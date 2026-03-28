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

	pc, err := pinecone.NewClient(pinecone.Config{
		ApiKey: apiKey,
	})

	if err != nil {
		return nil, err
	}

	index := pc.Index("news-index")

	return &Client{
		Index: index,
	}, nil
}
