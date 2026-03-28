package mongo

import (
	"PrasadNaik1310/archer/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type ChunkRepository struct {
	collection *mongo.Collection
}

func NewChunkRepository(db *mongo.Database) *ChunkRepository {
	return &ChunkRepository{
		collection: db.Collection("chunks"),
	}
}

func (r *ChunkRepository) Create(ctx context.Context, chunk *models.Chunk) error {
	if chunk.Timestamp.IsZero() {
		chunk.Timestamp = time.Now()
	}
	_, err := r.collection.InsertOne(ctx, chunk)
	return err
}

// 2. get_chunks_by_event(event_id)
// Essential for Requirement #4 (the full get_story payload)
func (r *ChunkRepository) GetByEventID(ctx context.Context, eventID string) ([]models.Chunk, error) {
	var chunks []models.Chunk
	cursor, err := r.collection.Find(ctx, bson.M{"event_id": eventID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &chunks); err != nil {
		return nil, err
	}
	return chunks, nil
}
