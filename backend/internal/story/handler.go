package story

import (
	"PrasadNaik1310/archer/internal/db/mongo"
	"PrasadNaik1310/archer/internal/models"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
)

// Handler handles the HTTP requests for Stories
type Handler struct {
	storyRepo *mongo.StoryRepository
	eventRepo *mongo.EventRepository
	chunkRepo *mongo.ChunkRepository
}

// NewHandler creates a new instance of the Story Handler
func NewHandler(storyRepo *mongo.StoryRepository, eventRepo *mongo.EventRepository, chunkRepo *mongo.ChunkRepository) *Handler {
	return &Handler{
		storyRepo: storyRepo,
		eventRepo: eventRepo,
		chunkRepo: chunkRepo,
	}
}

// ListStories handles GET /stories
func (h *Handler) ListStories(c *gin.Context) {
	stories, err := h.storyRepo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load stories"})
		return
	}

	// Newest first gives better defaults when frontend picks first fallback story.
	sort.Slice(stories, func(i, j int) bool {
		return stories[i].UpdatedAt.After(stories[j].UpdatedAt)
	})

	c.JSON(http.StatusOK, stories)
}

// GetStory handles GET /stories/:id
func (h *Handler) GetStory(c *gin.Context) {
	// 1. Grab the ID from the URL (e.g., /stories/story-101)
	storyID := c.Param("id")
	if storyID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Story ID is required"})
		return
	}

	storyData, err := h.storyRepo.GetByID(storyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Story not found or database error"})
		return
	}

	events, err := h.eventRepo.GetByStoryID(storyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load story events"})
		return
	}

	response, err := BuildStoryResponse(storyData, events, h.chunkRepo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to build story response"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// CreateStory handles POST /stories
func (h *Handler) CreateStory(c *gin.Context) {
	var story models.Story

	// 1. Parse the incoming JSON
	if err := c.ShouldBindJSON(&story); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid story data: " + err.Error()})
		return
	}

	err := h.storyRepo.Create(story)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create story"})
		return
	}

	c.JSON(http.StatusCreated, story)
}

// UpdateStory handles PUT /api/v1/stories/:id
func (h *Handler) UpdateStory(c *gin.Context) {
	id := c.Param("id")
	var story models.Story

	if err := c.ShouldBindJSON(&story); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	if err := h.storyRepo.Update(c.Request.Context(), id, &story); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update story"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Story updated successfully"})
}

// DeleteStory handles DELETE /api/v1/stories/:id
func (h *Handler) DeleteStory(c *gin.Context) {
	id := c.Param("id")

	if err := h.storyRepo.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete story"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Story deleted successfully"})
}
