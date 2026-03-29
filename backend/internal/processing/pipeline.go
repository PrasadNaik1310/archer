package processing

import (
	"context"
	"errors"
	"time"

	"PrasadNaik1310/archer/internal/db/mongo"
	"PrasadNaik1310/archer/internal/db/vector"
	"PrasadNaik1310/archer/internal/models"

	"github.com/google/uuid"
)

type Pipeline struct {
	processor  *Processor
	chunkRepo  *mongo.ChunkRepository
	eventRepo  *mongo.EventRepository
	storyRepo  *mongo.StoryRepository
	vectorRepo *vector.VectorRepo
}

type eventCandidate struct {
	event models.Event
	score float32
}

func NewPipeline(
	processor *Processor,
	chunkRepo *mongo.ChunkRepository,
	eventRepo *mongo.EventRepository,
	storyRepo *mongo.StoryRepository,
	vectorRepo *vector.VectorRepo,
) *Pipeline {
	return &Pipeline{
		processor:  processor,
		chunkRepo:  chunkRepo,
		eventRepo:  eventRepo,
		storyRepo:  storyRepo,
		vectorRepo: vectorRepo,
	}
}

func (p *Pipeline) ProcessArticle(article string) error {
	if article == "" {
		return errors.New("article text is required")
	}

	chunks := p.processor.ProcessArticle(article)

	for _, chunk := range chunks {
		if err := p.chunkRepo.Create(chunk); err != nil {
			return err
		}

		embedding64, err := GetEmbedding(chunk.Text)
		if err != nil {
			return err
		}
		embedding32 := toFloat32Slice(embedding64)

		if err := p.vectorRepo.StoreEmbedding(chunk.ChunkID, embedding32); err != nil {
			return err
		}

		matches, err := p.vectorRepo.FindSimilar(embedding32, 5)
		if err != nil {
			return err
		}

		candidates := make([]eventCandidate, 0, len(matches))
		for _, match := range matches {
			if match.ID == "" || match.ID == chunk.ChunkID {
				continue
			}

			similarChunk, err := p.chunkRepo.GetByID(match.ID)
			if err != nil || similarChunk.EventID == "" {
				continue
			}

			event, err := p.eventRepo.GetByID(similarChunk.EventID)
			if err != nil {
				continue
			}

			candidates = append(candidates, eventCandidate{event: event, score: match.Score})
		}

		eventID := assignEventID(chunk, candidates)
		chunk.EventID = eventID
		if err := p.chunkRepo.UpdateEventID(chunk.ChunkID, eventID); err != nil {
			return err
		}

		storyID, err := p.assignStoryID(chunk, candidates)
		if err != nil {
			return err
		}

		event := models.Event{
			EventID:   eventID,
			StoryID:   storyID,
			Summary:   chunk.Summary,
			Entities:  chunk.Entities,
			Sentiment: chunk.Sentiment,
			Timestamp: chunk.Timestamp,
		}

		if len(candidates) == 0 || eventID == chunk.ChunkID {
			if err := p.eventRepo.Create(event); err != nil {
				return err
			}
		} else {
			if err := p.eventRepo.UpdateStoryID(eventID, storyID); err != nil {
				return err
			}
		}

		if err := p.createOrUpdateStory(storyID, chunk.Entities); err != nil {
			return err
		}
	}

	return nil
}

func (p *Pipeline) assignStoryID(chunk models.Chunk, candidates []eventCandidate) (string, error) {
	// STEP 1: Check high-similarity candidates with entity overlap
	for _, candidate := range candidates {
		// Only consider candidates above similarity threshold
		if candidate.score >= 0.7 && candidate.event.StoryID != "" {
			// Verify entities actually overlap
			overlap := entityOverlap(chunk.Entities, candidate.event.Entities)
			if overlap > 0 {
				return candidate.event.StoryID, nil
			}
		}
	}

	// STEP 2: Fall back to finding stories with entity overlap
	stories, err := p.storyRepo.GetAll()
	if err != nil {
		return "", err
	}

	var selectedStoryID string
	bestOverlap := 0.0
	for _, existing := range stories {
		overlap := entityOverlap(chunk.Entities, existing.Entities)
		if overlap > bestOverlap {
			bestOverlap = overlap
			selectedStoryID = existing.StoryID
		}
	}

	// Only reuse a story if there's meaningful entity overlap (>=30%)
	if bestOverlap >= 0.3 && selectedStoryID != "" {
		return selectedStoryID, nil
	}

	// STEP 3: No good match found, create new story
	return uuid.New().String(), nil
}

func (p *Pipeline) createOrUpdateStory(storyID string, entities []string) error {
	story, err := p.storyRepo.GetByID(storyID)
	if err == nil {
		story.Entities = mergeEntities(story.Entities, entities)
		return p.storyRepo.Update(context.Background(), storyID, &story)
	}

	now := time.Now()
	return p.storyRepo.Create(models.Story{
		StoryID:   storyID,
		Title:     "Auto Generated Story",
		Entities:  entities,
		CreatedAt: now,
		UpdatedAt: now,
	})
}

func assignEventID(chunk models.Chunk, candidates []eventCandidate) string {
	if len(candidates) == 0 {
		return chunk.ChunkID
	}

	selected := candidates[0]
	for _, c := range candidates[1:] {
		if c.score > selected.score {
			selected = c
		}
	}

	if selected.score >= 0.8 {
		return selected.event.EventID
	}

	return chunk.ChunkID
}

func entityOverlap(a, b []string) float64 {
	if len(a) == 0 || len(b) == 0 {
		return 0
	}

	matches := 0
	for _, x := range a {
		for _, y := range b {
			if x == y {
				matches++
				break
			}
		}
	}

	return float64(matches) / float64(len(a))
}

func mergeEntities(base []string, extra []string) []string {
	seen := map[string]struct{}{}
	merged := make([]string, 0, len(base)+len(extra))
	for _, e := range base {
		if _, ok := seen[e]; !ok {
			seen[e] = struct{}{}
			merged = append(merged, e)
		}
	}
	for _, e := range extra {
		if _, ok := seen[e]; !ok {
			seen[e] = struct{}{}
			merged = append(merged, e)
		}
	}
	return merged
}

func toFloat32Slice(values []float64) []float32 {
	result := make([]float32, len(values))
	for i, v := range values {
		result[i] = float32(v)
	}
	return result
}
