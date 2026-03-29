package story

import (
	"context"

	"PrasadNaik1310/archer/internal/db/mongo"
	"PrasadNaik1310/archer/internal/models"
)

func BuildStoryResponse(storyData models.Story, events []models.Event, chunkRepo *mongo.ChunkRepository) (models.FullStoryResponse, error) {
	response := models.FullStoryResponse{Story: storyData}

	for _, event := range events {
		chunks, err := chunkRepo.GetByEventID(context.Background(), event.EventID)
		if err != nil {
			return models.FullStoryResponse{}, err
		}

		response.Events = append(response.Events, models.EventWithChunks{
			Event:  event,
			Chunks: chunks,
		})
	}

	return response, nil
}
