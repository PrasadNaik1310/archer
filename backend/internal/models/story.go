package models

import "time"

type Story struct {
	// We use string here so we can control the IDs
	StoryID   string    `json:"story_id" bson:"story_id"`
	Title     string    `json:"title" bson:"title"`
	Entities  []string  `json:"entities" bson:"entities"`
	CreatedAt time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time `json:"updated_at" bson:"updated_at"`
}
