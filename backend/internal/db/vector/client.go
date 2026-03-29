package vector

import (
	"os"

	pinecone "github.com/pinecone-io/go-pinecone/v2/pinecone"
)

type Client struct {
	Index *pinecone.IndexConnection
}

func NewClient() (*Client, error) {
	apiKey := os.Getenv("PINECONE_API_KEY")
	indexHost := os.Getenv("PINECONE_INDEX_HOST")

	pc, err := pinecone.NewClient(pinecone.NewClientParams{ApiKey: apiKey})

	if err != nil {
		return nil, err
	}

	index, err := pc.Index(pinecone.NewIndexConnParams{
		Host: indexHost,
	})
	if err != nil {
		return nil, err
	}

	return &Client{
		Index: index,
	}, nil
}
