package story

import (
	"PrasadNaik1310/archer/internal/models"
	"net/http"
	"github.com/gin-gonic/gin"
)

// Handler handles the HTTP requests for Stories
type Handler struct {
	service *Service
}

// NewHandler creates a new instance of the Story Handler
func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

// GetStory handles GET /stories/:id
func (h *Handler) GetStory(c *gin.Context) {
	// 1. Grab the ID from the URL (e.g., /stories/story-101)
	storyID := c.Param("id")
	if storyID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Story ID is required"})
		return
	}

	// 2. Call your "Super-Query" service logic
	fullStory, err := h.service.GetFullStory(c.Request.Context(), storyID)
	if err != nil {
		// If story not found or DB error
		c.JSON(http.StatusNotFound, gin.H{"error": "Story not found or database error"})
		return
	}

	// 3. Return the beautiful nested JSON to the frontend
	c.JSON(http.StatusOK, fullStory)
}

// CreateStory handles POST /stories
func (h *Handler) CreateStory(c *gin.Context) {
	var story models.Story

	// 1. Parse the incoming JSON
	if err := c.ShouldBindJSON(&story); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid story data: " + err.Error()})
		return
	}

	// 2. Call the service to save it
	createdStory, err := h.service.CreateStory(c.Request.Context(), &story)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create story"})
		return
	}

	// 3. Return the created story (including its new StoryID)
	c.JSON(http.StatusCreated, createdStory)
}

// UpdateStory handles PUT /api/v1/stories/:id
func (h *Handler) UpdateStory(c *gin.Context) {
	id := c.Param("id")
	var story models.Story
	
	if err := c.ShouldBindJSON(&story); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	if err := h.service.UpdateStory(c.Request.Context(), id, &story); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update story"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Story updated successfully"})
}

// DeleteStory handles DELETE /api/v1/stories/:id
func (h *Handler) DeleteStory(c *gin.Context) {
	id := c.Param("id")
	
	if err := h.service.DeleteStory(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete story"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Story deleted successfully"})
}