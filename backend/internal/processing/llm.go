package processing

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"strings"
)

type EntityExtractionRequest struct {
	Text string `json:"text"`
}

type Entity struct {
	Text  string `json:"text"`
	Label string `json:"label"`
}

type EntityExtractionResponse struct {
	Entities []Entity `json:"entities"`
	Text     string   `json:"text"`
}

// Note: httpClient is defined in embedding_client.go to avoid duplication

// AnalyzeText performs NER and sentiment analysis
func AnalyzeText(text string) (summary string, entities []string, sentiment string) {
	// Generate summary
	if len(text) > 100 {
		summary = text[:100] + "..."
	} else {
		summary = text
	}

	// Extract entities using Python NER service
	extractedEntities := extractEntitiesFromPython(text)
	entities = extractedEntities

	// Analyze sentiment
	sentiment = analyzeSentiment(text)

	log.Printf("[LLM] Analyzed text: entities=%v, sentiment=%s", entities, sentiment)
	return
}

// extractEntitiesFromPython calls the Python embedding service NER endpoint
func extractEntitiesFromPython(text string) []string {
	reqBody := EntityExtractionRequest{Text: text}
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		log.Printf("[NER] Error marshaling request: %v", err)
		return []string{}
	}

	resp, err := httpClient.Post(
		getEmbeddingServiceBaseURL()+"/extract-entities",
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		log.Printf("[NER] Error calling extraction service: %v", err)
		return []string{}
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("[NER] Error reading response: %v", err)
		return []string{}
	}

	var result EntityExtractionResponse
	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("[NER] Error unmarshaling response: %v", err)
		return []string{}
	}

	// Convert entities to just text strings
	entityTexts := make([]string, len(result.Entities))
	for i, ent := range result.Entities {
		entityTexts[i] = ent.Text
	}

	log.Printf("[NER] Extracted %d entities: %v", len(entityTexts), entityTexts)
	return entityTexts
}

// analyzeSentiment performs basic sentiment analysis
func analyzeSentiment(text string) string {
	text = strings.ToLower(text)

	// Negative indicators
	negativeWords := []string{
		"fall", "crash", "decline", "plunge", "collapse",
		"down", "loss", "failed", "failure", "negative", "bad", "worse",
		"scandal", "fraud", "allegations", "accusation", "investigation",
		"risk", "threat", "dangerous", "crisis",
	}

	// Positive indicators
	positiveWords := []string{
		"rise", "growth", "surge", "jump", "boost", "gain", "profit",
		"success", "strong", "leading", "excellent", "innovative",
		"breakthrough", "launch", "improve", "improved", "better", "best",
		"outperform", "beats", "record",
	}

	negativeCount := 0
	for _, word := range negativeWords {
		if strings.Contains(text, word) {
			negativeCount++
		}
	}

	positiveCount := 0
	for _, word := range positiveWords {
		if strings.Contains(text, word) {
			positiveCount++
		}
	}

	if negativeCount > positiveCount {
		return "negative"
	} else if positiveCount > negativeCount {
		return "positive"
	}
	return "neutral"
}
