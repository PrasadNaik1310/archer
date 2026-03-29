package main

import (
	"fmt"
	"log"
	"os"

	"PrasadNaik1310/archer/internal/api"
	"PrasadNaik1310/archer/internal/db/mongo"
	"PrasadNaik1310/archer/internal/db/vector"
	"PrasadNaik1310/archer/internal/ingestion"
	"PrasadNaik1310/archer/internal/processing"
	"PrasadNaik1310/archer/internal/story"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

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

	allowedOrigin := os.Getenv("FRONTEND_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "https://archer-drab.vercel.app"
	}

	// Router
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// 🔥 Add CORS (VERY IMPORTANT for Vercel frontend)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	})

	api.SetupRoutes(r, storyHandler, ingestionHandler)

	fmt.Printf("🚀 Archer API is LIVE on port %s\n", port)

	r.Run(":" + port)
}
