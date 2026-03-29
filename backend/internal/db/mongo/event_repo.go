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

func (r *EventRepository) Create(event models.Event) error {
	if event.Timestamp == 0 {
		event.Timestamp = time.Now().Unix()
	}
	_, err := r.collection.InsertOne(context.Background(), event)
	return err
}

func (r *EventRepository) GetByID(eventID string) (models.Event, error) {
	var event models.Event
	err := r.collection.FindOne(context.Background(), bson.M{"event_id": eventID}).Decode(&event)
	return event, err
}

func (r *EventRepository) GetByStoryID(storyID string) ([]models.Event, error) {
	var events []models.Event
	ctx := context.Background()

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

func (r *EventRepository) UpdateStoryID(eventID string, storyID string) error {
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"event_id": eventID},
		bson.M{"$set": bson.M{"story_id": storyID}},
	)
	return err
}
