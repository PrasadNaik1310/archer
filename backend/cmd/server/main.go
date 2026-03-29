package main

import (
	"PrasadNaik1310/archer/internal/db/mongo"
	"fmt"
	"log"

	"PrasadNaik1310/archer/internal/api"

	"PrasadNaik1310/archer/internal/story"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Support running from different working directories (e.g. backend/ or backend/cmd/server).
	for _, envPath := range []string{".env", "../.env", "../../.env"} {
		if err := godotenv.Load(envPath); err == nil {
			break
		}
	}

	// 1. Database Connection
	client, err := mongo.NewClient()
	if err != nil {
		log.Fatalf("❌ Mongo Error: %v", err)
	}
	db := client.Conn.Database("Archer")

	// 2. Initialize your "STRICT" Data Layer
	sRepo := mongo.NewStoryRepository(db)
	eRepo := mongo.NewEventRepository(db)
	cRepo := mongo.NewChunkRepository(db)

	// 3. Initialize the Service (The Brain)
	storyService := story.NewService(sRepo, eRepo, cRepo)

	// 4. Initialize the Handler (The Voice)
	storyHandler := story.NewHandler(storyService)

	// 5. Setup Gin and Routes
	r := gin.Default()
	api.SetupRoutes(r, storyHandler)

	fmt.Println("🚀 Archer API is LIVE on http://localhost:8080")

	// Start the server!
	r.Run(":8080")
}
