package story

import (
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
