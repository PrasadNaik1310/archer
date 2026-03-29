## Archer Backend Deployment (Render)

This backend runs as a single service/container:

- One Docker container running both:
	- Go API (public, port `PORT`)
	- Python embedding + NER service (internal, `EMBEDDING_INTERNAL_PORT`)

The repository already includes:

- `render.yaml`
- `backend/Dockerfile`
- `backend/scripts/start.sh`

### 1) Deploy with Render Blueprint

From Render Dashboard:

1. New -> Blueprint
2. Connect this repository
3. Render reads `render.yaml` and creates one service

### 2) Set Required Environment Variables

Set these in Render for `archer-backend`:

```bash
PORT=8080
EMBEDDING_INTERNAL_PORT=8000
EMBEDDING_SERVICE_URL=http://127.0.0.1:8000
MONGO_URI=<your-mongodb-atlas-uri>
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_INDEX_HOST=<your-pinecone-index-host>
FRONTEND_ORIGIN=https://<your-frontend-domain>
```

Notes:

- `EMBEDDING_SERVICE_URL` should stay `http://127.0.0.1:8000` for single-container mode.
- `PINECONE_INDEX_HOST` should be host only (no protocol).

### 3) Verify Deployment

Replace `<api-url>` with your Render service URL.

Health check (Go API):

```bash
curl -s https://<api-url>/
```

Expected: JSON with status fields.

List all stories (for frontend discovery):

```bash
curl -s https://<api-url>/stories
```

Embedding endpoint (proxied internally via Go pipeline):

```bash
curl -s -X POST https://<api-url>/ingest \
	-H "Content-Type: application/json" \
	-d '{"text":"Apple launches new iPhone with better battery"}'
```

Ingest + story flow:

```bash
curl -s -X POST https://<api-url>/ingest \
	-H "Content-Type: application/json" \
	-d '{"text":"Adani stocks fall sharply after Hindenburg report"}'

curl -s -X POST https://<api-url>/ingest \
	-H "Content-Type: application/json" \
	-d '{"text":"Adani shares crash again due to Hindenburg allegations"}'

curl -s -X POST https://<api-url>/ingest \
	-H "Content-Type: application/json" \
	-d '{"text":"Apple launches new iPhone with better battery"}'
```

Then fetch a story ID from MongoDB and test:

```bash
curl -s https://<api-url>/story/<story_id>
```

### 4) Common Issues

- `failed to connect Pinecone`: check `PINECONE_API_KEY` and `PINECONE_INDEX_HOST`
- `dial tcp ... :8000`: internal embedding process failed, check service logs
- CORS errors from frontend: set `FRONTEND_ORIGIN` to exact frontend origin

### 5) Precomputed MiniLM Mode (Recommended for 512MB)

Use this mode to keep MiniLM in architecture while avoiding live model inference memory costs.

How it works:

- MiniLM embeddings are generated offline once.
- Runtime `/embed` serves vectors from a precomputed cache file.
- `/extract-entities` still works via spaCy NER.

Prepare cache file locally:

```bash
cd backend
python scripts/precompute_embeddings.py \
	--input configs/demo_texts.json \
	--output embedding-service/precomputed_embeddings.json
```

Set these env vars in Render (`archer-backend`):

```bash
EMBEDDING_MODE=precomputed
PRECOMPUTED_EMBEDDINGS_FILE=/app/embedding-service/precomputed_embeddings.json
```

Optional fallback to full online model inference:

```bash
EMBEDDING_MODE=online
```

### 6) Seed More Data For Category Coverage

When using `EMBEDDING_MODE=precomputed`, every text you ingest must exist in your precomputed cache.

1) Build a larger precomputed cache from category seed texts:

```bash
cd backend
python scripts/precompute_embeddings.py \
	--input configs/category_seed_texts.json \
	--output embedding-service/precomputed_embeddings.json
```

2) Redeploy backend so updated `precomputed_embeddings.json` is live.

3) Bulk-ingest those texts into your API:

```bash
python scripts/seed_ingest.py \
	--api-url https://<api-url> \
	--input configs/category_seed_texts.json
```

4) Verify stories were created and can be consumed by frontend:

```bash
curl -s https://<api-url>/stories
```

