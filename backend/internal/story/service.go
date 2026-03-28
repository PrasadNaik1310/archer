package story

import (
	"PrasadNaik1310/archer/internal/models"

	"github.com/google/uuid"
)

type SimilarChunk struct {
	Chunk   models.Chunk
	Score   float64 // embedding similarity
	EventID string
}

func AssignEvent(newChunk models.Chunk, candidates []SimilarChunk) string {

	bestScore := 0.0
	bestEventID := ""

	for _, c := range candidates {

		entityOverlap := calculateEntityOverlap(newChunk.Entities, c.Chunk.Entities)

		score := (0.7 * c.Score) + (0.3 * entityOverlap)

		if score > bestScore {
			bestScore = score
			bestEventID = c.EventID
		}
	}

	// threshold decision
	if bestScore > 0.75 {
		return bestEventID
	}

	// new event
	return generateEventID()
}

func generateEventID() string {
	return "event_" + uuid.New().String()
}
func AssignStory(newEvent models.Event, existingStories []models.Story) string {

	bestScore := 0.0
	bestStoryID := ""

	for _, s := range existingStories {
		score := calculateEntityOverlap(newEvent.Entities, s.Entities)

		if score > bestScore {
			bestScore = score
			bestStoryID = s.StoryID
		}
	}

	// threshold
	if bestScore > 0.5 {
		return bestStoryID
	}

	// new story
	return generateStoryID()
}
func generateStoryID() string {
	return "story_" + uuid.New().String()
}
