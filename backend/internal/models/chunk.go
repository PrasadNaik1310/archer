package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Chunk struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	EventID     primitive.ObjectID `bson:"event_id" json:"event_id"`
	StoryID     primitive.ObjectID `bson:"story_id" json:"story_id"`
	Text        string             `bson:"text" json:"text"`
	Summary     string             `bson:"summary" json:"summary"`
	Sentiment   string             `bson:"sentiment" json:"sentiment"`
	EmbeddingID string             `bson:"embedding_id" json:"embedding_id"`
	Timestamp   time.Time          `bson:"timestamp" json:"timestamp"`
}