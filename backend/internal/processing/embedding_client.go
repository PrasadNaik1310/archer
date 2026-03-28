package processing

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type EmbeddingRequest struct {
	Text string `json:"text"`
}

type EmbeddingResponse struct {
	Embedding []float64 `json:"embedding"`
}

var httpClient = &http.Client{
	Timeout: 5 * time.Second,
}

func GetEmbedding(text string) ([]float64, error) {

	reqBody := EmbeddingRequest{
		Text: text,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	resp, err := httpClient.Post(
		"http://localhost:8000/embed",
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {

		return nil, err
	}
	fmt.Println("calling python embedding service")
	defer resp.Body.Close()

	var result EmbeddingResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if len(result.Embedding) == 0 {
		return nil, fmt.Errorf("empty embedding received")
	}

	return result.Embedding, nil
}
