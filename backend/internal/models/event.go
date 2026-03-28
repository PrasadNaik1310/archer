package models

type Event struct {
	EventID   string
	StoryID   string
	Summary   string
	Entities  []string
	Sentiment string
	Timestamp int64
}
