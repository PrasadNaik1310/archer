package mongo

import (
	"PrasadNaik1310/archer/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
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

func (r *StoryRepository) Create(story models.Story) error {
	now := time.Now()
	if story.CreatedAt.IsZero() {
		story.CreatedAt = now
	}
	story.UpdatedAt = now

	_, err := r.collection.InsertOne(context.Background(), story)
	return err
}

func (r *StoryRepository) GetByID(storyID string) (models.Story, error) {
	var story models.Story
	err := r.collection.FindOne(context.Background(), bson.M{"story_id": storyID}).Decode(&story)
	return story, err
}

func (r *StoryRepository) GetAll() ([]models.Story, error) {
	ctx := context.Background()
	var stories []models.Story

	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &stories); err != nil {
		return nil, err
	}

	return stories, nil
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
