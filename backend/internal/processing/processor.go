package processing

import (
	"time"

	"PrasadNaik1310/archer/internal/models"

	"github.com/google/uuid"
)

type Processor struct{}

func NewProcessor() *Processor {
	return &Processor{}
}

func (p *Processor) ProcessArticle(text string) []models.Chunk {

	// 1. chunk text
	chunksText := ChunkText(text, 80)

	var result []models.Chunk

	for _, chunkText := range chunksText {

		// 2. LLM processing
		summary, entities, sentiment := AnalyzeText(chunkText)

		// 3. embedding
		embedding, err := GetEmbedding(chunkText)
		if err != nil {
			// fallback (important for stability)
			embedding = []float64{}
		}

		chunk := models.Chunk{
			ChunkID:   uuid.New().String(),
			Text:      chunkText,
			Summary:   summary,
			Entities:  entities,
			Sentiment: sentiment,
			Embedding: embedding,
			Timestamp: time.Now().Unix(),
		}

		result = append(result, chunk)
	}

	return result
}
