package story

import (
	"context"
	"PrasadNaik1310/archer/internal/db/mongo"
	"PrasadNaik1310/archer/internal/models"
)

// Service handles the business logic for Stories
type Service struct {
	repo      *mongo.StoryRepository
	eventRepo *mongo.EventRepository
	chunkRepo *mongo.ChunkRepository
}

// NewService creates a new instance of the Story Service
func NewService(r *mongo.StoryRepository, e *mongo.EventRepository, c *mongo.ChunkRepository) *Service {
	return &Service{
		repo:      r,
		eventRepo: e,
		chunkRepo: c,
	}
}

// GetFullStory fetches a story, all its events, and all chunks for those events
func (s *Service) GetFullStory(ctx context.Context, storyID string) (*models.FullStoryResponse, error) {
	// 1. Get the base Story info
	story, err := s.repo.GetByID(ctx, storyID)
	if err != nil {
		return nil, err
	}

	// 2. Get all Events linked to this Story
	events, err := s.eventRepo.GetByStoryID(ctx, storyID)
	if err != nil {
		return nil, err
	}

	// 3. For every Event, find the Chunks (Articles) that belong to it
	var timeline []models.EventWithChunks
	for _, event := range events {
		// We use the event's ID to find its chunks
		chunks, _ := s.chunkRepo.GetByEventID(ctx, event.EventID)
		
		timeline = append(timeline, models.EventWithChunks{
			Event:  event,
			Chunks: chunks,
		})
	}

	// 4. Return the complete package
	return &models.FullStoryResponse{
		Story:  *story,
		Events: timeline,
	}, nil
}