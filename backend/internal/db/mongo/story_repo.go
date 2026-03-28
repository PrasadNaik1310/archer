package mongo

import (
	"PrasadNaik1310/archer/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

type StoryRepository struct {
	collection *mongo.Collection
}

func NewStoryRepository(db *mongo.Database) *StoryRepository {
	return &StoryRepository{
		collection: db.Collection("stories"),
	}
}

func (r *StoryRepository) Create(ctx context.Context, story *models.Story) error {
	story.CreatedAt = time.Now()
	story.UpdatedAt = time.Now()
	_, err := r.collection.InsertOne(ctx, story)
	return err
}

func (r *StoryRepository) GetByID(ctx context.Context, storyID string) (*models.Story, error) {
	var story models.Story
	err := r.collection.FindOne(ctx, map[string]string{"story_id": storyID}).Decode(&story)
	return &story, err
}
