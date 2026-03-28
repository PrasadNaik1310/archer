package models

import "time"

type Event struct {
	EventID   string    `json:"event_id" bson:"event_id"`
	StoryID   string    `json:"story_id" bson:"story_id"`
	Summary   string    `json:"summary" bson:"summary"`
	Sentiment string    `json:"sentiment" bson:"sentiment"`
	Entities  []string  `json:"entities" bson:"entities"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
}