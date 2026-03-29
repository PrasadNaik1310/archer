package mongo

import (
	"PrasadNaik1310/archer/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/bson"
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

// Update updates a story document in MongoDB
func (r *StoryRepository) Update(ctx context.Context, id string, story *models.Story) error {
	filter := bson.M{"story_id": id}
	update := bson.M{
		"$set": bson.M{
			"title":      story.Title,
			"entities":   story.Entities,
			"updated_at": time.Now(),
		},
	}
	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}

// Delete removes a story document from MongoDB
func (r *StoryRepository) Delete(ctx context.Context, id string) error {
	filter := bson.M{"story_id": id}
	_, err := r.collection.DeleteOne(ctx, filter)
	return err
}
