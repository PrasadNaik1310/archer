package api

import (
	"encoding/json"
	"net/http"
	"time"

	"PrasadNaik1310/archer/internal/models"
	"PrasadNaik1310/archer/internal/story"
)

func GetStoryHandler(w http.ResponseWriter, r *http.Request) {

	// 🔥 MOCK DATA (replace with Mongo later)

	storyData := models.Story{
		StoryID:  "story_1",
		Title:    "Adani Crisis",
		Entities: []string{"Adani", "SEBI"},
	}

	events := []models.Event{
		{
			EventID:   "e1",
			Summary:   "Adani stock crash",
			Entities:  []string{"Adani"},
			Sentiment: "negative",
			Timestamp: time.Unix(1712340000, 0),
		},
		{
			EventID:   "e2",
			Summary:   "SEBI starts investigation",
			Entities:  []string{"SEBI", "Adani"},
			Sentiment: "neutral",
			Timestamp: time.Unix(1712350000, 0),
		},
	}

	response := story.BuildStoryResponse(storyData, events)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}