package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"PrasadNaik1310/archer/internal/api"
	"PrasadNaik1310/archer/internal/db/mongo"
	"PrasadNaik1310/archer/internal/db/vector"
	"PrasadNaik1310/archer/internal/ingestion"
	"PrasadNaik1310/archer/internal/processing"
	"PrasadNaik1310/archer/internal/story"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func parseAllowedOrigins(raw string) []string {
	if strings.TrimSpace(raw) == "" {
		return []string{
			"https://archer-drab.vercel.app",
			"https://*.vercel.app",
			"http://localhost:5173",
			"http://127.0.0.1:5173",
		}
	}

	parts := strings.Split(raw, ",")
	origins := make([]string, 0, len(parts))
	for _, part := range parts {
		origin := strings.TrimSpace(part)
		if origin != "" {
			origins = append(origins, origin)
		}
	}

	return origins
}

func matchesOrigin(origin, pattern string) bool {
	if pattern == "*" {
		return true
	}

	if !strings.Contains(pattern, "*") {
		return origin == pattern
	}

	segments := strings.Split(pattern, "*")
	if len(segments) != 2 {
		return false
	}

	return strings.HasPrefix(origin, segments[0]) && strings.HasSuffix(origin, segments[1])
}

func isAllowedOrigin(origin string, allowedOrigins []string) bool {
	for _, pattern := range allowedOrigins {
		if matchesOrigin(origin, pattern) {
			return true
		}
	}

	return false
}

func main() {

	// Load .env from multiple paths
	for _, envPath := range []string{".env", "../.env", "../../.env"} {
		if err := godotenv.Load(envPath); err == nil {
			break
		}
	}

	mongoClient, err := mongo.NewClient()
	if err != nil {
		log.Fatalf("❌ failed to connect MongoDB: %v", err)
	}
	db := mongoClient.Conn.Database("Archer")

	vectorClient, err := vector.NewClient()
	if err != nil {
		log.Fatalf("❌ failed to connect Pinecone: %v", err)
	}

	storyRepo := mongo.NewStoryRepository(db)
	eventRepo := mongo.NewEventRepository(db)
	chunkRepo := mongo.NewChunkRepository(db)
	vectorRepo := vector.NewVectorRepo(vectorClient)

	pipeline := processing.NewPipeline(
		processing.NewProcessor(),
		chunkRepo,
		eventRepo,
		storyRepo,
		vectorRepo,
	)
	ingestionService := ingestion.NewService(pipeline)
	ingestionHandler := ingestion.NewHandler(ingestionService)
	storyHandler := story.NewHandler(storyRepo, eventRepo, chunkRepo)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	allowedOrigins := parseAllowedOrigins(os.Getenv("FRONTEND_ORIGIN"))

	// Router
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// 🔥 Add CORS (VERY IMPORTANT for Vercel frontend)
	r.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" && isAllowedOrigin(origin, allowedOrigins) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Vary", "Origin")
		}

		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			if origin != "" && !isAllowedOrigin(origin, allowedOrigins) {
				c.AbortWithStatus(403)
				return
			}

			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api.SetupRoutes(r, storyHandler, ingestionHandler)

	fmt.Printf("🚀 Archer API is LIVE on port %s\n", port)

	r.Run(":" + port)
}
