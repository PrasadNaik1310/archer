package main

import (
	"fmt"
	"log"
	"github.com/joho/godotenv"
	"PrasadNaik1310/archer/internal/db/mongo"
	
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

	fmt.Println("🚀 Archer Backend is officially LIVE!")

	
	
	// This prevents the program from closing immediately
	_ = client
	select {} 
}