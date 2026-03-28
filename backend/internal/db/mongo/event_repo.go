package mongo

import (
	"context"
	"time"
	"PrasadNaik1310/archer/internal/models"
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