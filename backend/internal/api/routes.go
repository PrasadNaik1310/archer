package api

import (
	"PrasadNaik1310/archer/internal/story"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures the API endpoints
func SetupRoutes(r *gin.Engine, storyHandler *story.Handler) {
	// Grouping under /api/v1 is a professional touch for hackathons
	v1 := r.Group("/api/v1")
	{
		// Story Routes
		stories := v1.Group("/stories")
		{
			// This matches GET /api/v1/stories/story-101
			stories.GET("/:id", storyHandler.GetStory)
		}

		// You can add more groups here later (e.g., /ingestion, /processing)
	}
}

func RegisterRoutes() {

	http.HandleFunc("/story", GetStoryHandler)
}
