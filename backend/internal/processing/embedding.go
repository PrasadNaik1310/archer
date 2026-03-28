package processing

import (
	"math/rand"
)

// Mock embedding (replace with real API later)
func GenerateEmbedding(text string) []float64 {
	vec := make([]float64, 10)
	for i := range vec {
		vec[i] = rand.Float64()
	}
	return vec
}
