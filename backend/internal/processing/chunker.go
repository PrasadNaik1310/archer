package processing

import (
	"strings"
)

func ChunkText(text string, maxWords int) []string {
	words := strings.Fields(text)

	var chunks []string
	for i := 0; i < len(words); i += maxWords {
		end := i + maxWords
		if end > len(words) {
			end = len(words)
		}
		chunk := strings.Join(words[i:end], " ")
		chunks = append(chunks, chunk)
	}

	return chunks
}
