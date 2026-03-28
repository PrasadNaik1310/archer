package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Event struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StoryID   primitive.ObjectID `bson:"story_id" json:"story_id"`
	Summary   string             `bson:"summary" json:"summary"`
	Entities  []string           `bson:"entities" json:"entities"`
	Sentiment string             `bson:"sentiment" json:"sentiment"` // positive | negative | neutral
	Timestamp time.Time          `bson:"timestamp" json:"timestamp"`
}