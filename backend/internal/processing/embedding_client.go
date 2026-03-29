package processing

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
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
		getEmbeddingServiceBaseURL()+"/embed",
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

func getEmbeddingServiceBaseURL() string {
	baseURL := strings.TrimSpace(os.Getenv("EMBEDDING_SERVICE_URL"))
	if baseURL == "" {
		baseURL = "http://localhost:8000"
	}

	return strings.TrimRight(baseURL, "/")
}
