package api

import (
	"PrasadNaik1310/archer/internal/ingestion"
	"PrasadNaik1310/archer/internal/story"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures the API endpoints
func SetupRoutes(r *gin.Engine, storyHandler *story.Handler, ingestionHandler *ingestion.Handler) {
	r.POST("/ingest", ingestionHandler.Ingest)
	r.GET("/story/:id", storyHandler.GetStory)
}
