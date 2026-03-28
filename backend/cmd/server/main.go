package main

import (
	"PrasadNaik1310/archer/internal/db/mongo"
	"PrasadNaik1310/archer/internal/models"
	"context"
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	// 1. Load the .env file (The Secret Key)
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ Warning: No .env file found, using system env")
	}

	// 2. Initialize the MongoDB Client
	client, err := mongo.NewClient()
	if err != nil {
		log.Fatalf("❌ Could not connect to Atlas: %v", err)
	}

	// 1. Get the Database
	db := client.Conn.Database("Archer")

	// 2. Initialize your 3 Repos
	sRepo := mongo.NewStoryRepository(db)
	eRepo := mongo.NewEventRepository(db)
	cRepo := mongo.NewChunkRepository(db)

	ctx := context.Background()

	// --- DATA LAYER SMOKE TEST ---
	fmt.Println("🧪 Testing the Hierarchy...")

	// Create a Story
	storyID := "story-101"
	s := &models.Story{StoryID: storyID, Title: "The Archer Mission"}
	_ = sRepo.Create(ctx, s)

	// Create an Event linked to that Story
	eventID := "event-202"
	e := &models.Event{EventID: eventID, StoryID: storyID, Summary: "Database Layer Verified"}
	_ = eRepo.Create(ctx, e)

	// Create a Chunk linked to that Event
	c := &models.Chunk{ChunkID: "chunk-303", EventID: eventID, Text: "This is raw data for the event."}
	_ = cRepo.Create(ctx, c)

	fmt.Println("✅ Data sent! Check Atlas for 'story-101', 'event-202', and 'chunk-303'.")
	// --- END SMOKE TEST ---

	fmt.Println("🚀 Archer Backend is officially LIVE!")

	// This prevents the program from closing immediately
	_ = client
	select {}
}
