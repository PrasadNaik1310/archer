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

func (r *ChunkRepository) Create(chunk models.Chunk) error {
	if chunk.Timestamp == 0 {
		chunk.Timestamp = time.Now().Unix()
	}
	_, err := r.collection.InsertOne(context.Background(), chunk)
	return err
}

func (r *ChunkRepository) GetByID(chunkID string) (models.Chunk, error) {
	var chunk models.Chunk
	err := r.collection.FindOne(context.Background(), bson.M{"chunk_id": chunkID}).Decode(&chunk)
	return chunk, err
}

func (r *ChunkRepository) UpdateEventID(chunkID string, eventID string) error {
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"chunk_id": chunkID},
		bson.M{"$set": bson.M{"event_id": eventID}},
	)
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
