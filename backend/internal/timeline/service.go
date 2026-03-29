package timeline

import (
	"sort"

	"PrasadNaik1310/archer/internal/models"
)

type TimelineEvent struct {
	EventID   string
	Timestamp int64
	Summary   string
	Entities  []string
	Sentiment string
}

func BuildTimeline(events []models.Event) []TimelineEvent {

	var timeline []TimelineEvent

	for _, e := range events {
		timeline = append(timeline, TimelineEvent{
			EventID:   e.EventID,
			Timestamp: e.Timestamp,
			Summary:   e.Summary,
			Entities:  e.Entities,
			Sentiment: e.Sentiment,
		})
	}

	// 🔥 Sort by time (MOST IMPORTANT)
	sort.Slice(timeline, func(i, j int) bool {
		return timeline[i].Timestamp < timeline[j].Timestamp
	})

	return timeline
}
