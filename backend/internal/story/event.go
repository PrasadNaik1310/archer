package story

func calculateEntityOverlap(a, b []string) float64 {
	if len(a) == 0 || len(b) == 0 {
		return 0
	}

	match := 0
	for _, e1 := range a {
		for _, e2 := range b {
			if e1 == e2 {
				match++
				break
			}
		}
	}

	return float64(match) / float64(len(a))
}
