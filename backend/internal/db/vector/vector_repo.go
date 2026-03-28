package vector

import (
	"context"

	pinecone "github.com/pinecone-io/go-pinecone/v2/pinecone"
)

type Metadata struct {
	ChunkID   string   `json:"chunk_id"`
	Timestamp int64    `json:"timestamp"`
	Entities  []string `json:"entities"`
	Text      string   `json:"text"`
}

// -----------------------------
// VECTOR REPO
// -----------------------------

type VectorRepo struct {
	index *pinecone.IndexConnection
}

func NewVectorRepo(client *Client) *VectorRepo {
	return &VectorRepo{
		index: client.Index,
	}
}

// -----------------------------
// STORE EMBEDDING
// -----------------------------

func (r *VectorRepo) StoreEmbedding(
	ctx context.Context,
	id string,
	vector []float32,
	metadata map[string]interface{},
) error {

	_, err := r.index.Upsert(ctx, []*pinecone.Vector{
		{
			Id:       id,
			Values:   vector,
			Metadata: metadata,
		},
	})

	return err
}

// -----------------------------
// FIND SIMILAR
// -----------------------------

func (r *VectorRepo) FindSimilar(
	ctx context.Context,
	vector []float32,
	topK int,
) ([]*pinecone.ScoredVector, error) {

	resp, err := r.index.Query(ctx, &pinecone.QueryRequest{
		Vector:          vector,
		TopK:            topK,
		IncludeMetadata: true,
	})

	if err != nil {
		return nil, err
	}

	return resp.Matches, nil
}