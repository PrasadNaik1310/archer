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

type Match struct {
	ID    string
	Score float32
}

func NewVectorRepo(client *Client) *VectorRepo {
	return &VectorRepo{
		index: client.Index,
	}
}

// -----------------------------
// STORE EMBEDDING
// -----------------------------

func (r *VectorRepo) StoreEmbedding(chunkID string, vector []float32) error {
	_, err := r.index.UpsertVectors(context.Background(), []*pinecone.Vector{
		{
			Id:     chunkID,
			Values: vector,
		},
	})

	return err
}

// -----------------------------
// FIND SIMILAR
// -----------------------------

func (r *VectorRepo) FindSimilar(vector []float32, topK int32) ([]Match, error) {

	resp, err := r.index.QueryByVectorValues(context.Background(), &pinecone.QueryByVectorValuesRequest{
		Vector: vector,
		TopK:   uint32(topK),
	})

	if err != nil {
		return nil, err
	}

	matches := make([]Match, 0, len(resp.Matches))
	for _, m := range resp.Matches {
		matchID := ""
		if m.Vector != nil {
			matchID = m.Vector.Id
		}
		matches = append(matches, Match{ID: matchID, Score: m.Score})
	}

	return matches, nil
}
