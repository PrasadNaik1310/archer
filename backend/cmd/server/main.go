package main

import (
	"fmt"

	"PrasadNaik1310/archer/internal/processing"
)

func main() {

	processor := processing.NewProcessor()

	article := `
Adani Group stocks fell sharply after a report by Hindenburg Research.
Investors are worried about market stability.
`

	chunks := processor.ProcessArticle(article)

	fmt.Println("=== EMBEDDING VERIFICATION ===")

	for i, c := range chunks {

		fmt.Printf("\n--- Chunk %d ---\n", i+1)

		fmt.Println("Text:", c.Text)
		fmt.Println("Summary:", c.Summary)
		fmt.Println("Entities:", c.Entities)
		fmt.Println("Sentiment:", c.Sentiment)

		// 🔥 KEY DEBUG
		fmt.Println("Embedding Length:", len(c.Embedding))

		if len(c.Embedding) > 0 {
			fmt.Println("First 5 values:", c.Embedding[:5])
		} else {
			fmt.Println("Embedding is EMPTY ❌")
		}
	}

	fmt.Println("\n=== DONE ===")
}
