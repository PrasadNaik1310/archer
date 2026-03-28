package models

type Chunk struct {
	ChunkID   string
	Text      string
	Summary   string
	Entities  []string
	Sentiment string
	Embedding []float64
	Timestamp int64
}
