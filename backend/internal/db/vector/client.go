package vector

import (
	"fmt"
	"os"
	"strings"

	pinecone "github.com/pinecone-io/go-pinecone/v2/pinecone"
)

type Client struct {
	Index *pinecone.IndexConnection
}

func NewClient() (*Client, error) {
	apiKey := os.Getenv("PINECONE_API_KEY")
	indexHost := os.Getenv("PINECONE_INDEX_HOST")
	if indexHost == "" {
		indexHost = os.Getenv("PINECONE_HOST")
	}

	if strings.TrimSpace(apiKey) == "" {
		return nil, fmt.Errorf("missing Pinecone API key: set PINECONE_API_KEY")
	}
	if strings.TrimSpace(indexHost) == "" {
		return nil, fmt.Errorf("missing Pinecone index host: set PINECONE_INDEX_HOST (or PINECONE_HOST)")
	}

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
