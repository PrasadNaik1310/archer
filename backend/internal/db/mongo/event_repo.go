package mongo

import (
	"PrasadNaik1310/archer/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type EventRepository struct {
	collection *mongo.Collection
}

func NewEventRepository(db *mongo.Database) *EventRepository {
	return &EventRepository{
		collection: db.Collection("events"),
	}
}

func (r *EventRepository) Create(ctx context.Context, event *models.Event) error {
	event.Timestamp = time.Now()
	_, err := r.collection.InsertOne(ctx, event)
	return err
}

func (r *EventRepository) GetByStoryID(ctx context.Context, storyID string) ([]models.Event, error) {
	var events []models.Event

	// We filter by story_id to get the whole timeline
	cursor, err := r.collection.Find(ctx, bson.M{"story_id": storyID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &events); err != nil {
		return nil, err
	}

	return events, nil
}
