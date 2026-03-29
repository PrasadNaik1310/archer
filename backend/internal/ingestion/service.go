package ingestion

import "PrasadNaik1310/archer/internal/processing"

type Service struct {
	pipeline *processing.Pipeline
}

func NewService(pipeline *processing.Pipeline) *Service {
	return &Service{pipeline: pipeline}
}

func (s *Service) Ingest(text string) error {
	return s.pipeline.ProcessArticle(text)
}
