package mongo

import (
	"context"
	"PrasadNaik1310/archer/internal/models"
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
	_, err := r.collection.InsertOne(ctx, chunk)
	return err
}