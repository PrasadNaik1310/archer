package models

import "time"

type Chunk struct {
	ChunkID     string    `json:"chunk_id" bson:"chunk_id"`
	EventID     string    `json:"event_id" bson:"event_id"`
	Text        string    `json:"text" bson:"text"`
	Summary     string    `json:"summary" bson:"summary"`
	Entities    []string  `json:"entities" bson:"entities"`
	Sentiment   string    `json:"sentiment" bson:"sentiment"`
	EmbeddingID string    `json:"embedding_id" bson:"embedding_id"`
	Timestamp   time.Time `json:"timestamp" bson:"timestamp"`
}
