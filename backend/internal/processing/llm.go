package processing

import (
	"strings"
)

// Mock function (replace with OpenAI later)
func AnalyzeText(text string) (summary string, entities []string, sentiment string) {

	// fake summary
	if len(text) > 100 {
		summary = text[:100] + "..."
	} else {
		summary = text
	}

	// fake entity extraction (VERY basic)
	if strings.Contains(strings.ToLower(text), "adani") {
		entities = append(entities, "Adani")
	}
	if strings.Contains(strings.ToLower(text), "sebi") {
		entities = append(entities, "SEBI")
	}

	// fake sentiment
	if strings.Contains(strings.ToLower(text), "fall") ||
		strings.Contains(strings.ToLower(text), "crash") {
		sentiment = "negative"
	} else {
		sentiment = "neutral"
	}

	return
}
