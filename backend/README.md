## Archer Backend Deployment (Render)

This backend runs as two services:

- Go API service (`archer-go-api`)
- Python embedding + NER service (`archer-embedding-service`)

The repository already includes:

- `render.yaml`
- `backend/Dockerfile`
- `backend/embedding-service/Dockerfile`

### 1) Deploy with Render Blueprint

From Render Dashboard:

1. New -> Blueprint
2. Connect this repository
3. Render reads `render.yaml` and creates both services

### 2) Set Required Environment Variables

Set these in Render after services are created.

For `archer-embedding-service`:

```bash
PORT=8000
```

For `archer-go-api`:

```bash
PORT=8080
EMBEDDING_SERVICE_URL=https://<your-embedding-service>.onrender.com
MONGO_URI=<your-mongodb-atlas-uri>
PINECONE_API_KEY=<your-pinecone-api-key>
PINECONE_INDEX_HOST=<your-pinecone-index-host>
FRONTEND_ORIGIN=https://<your-frontend-domain>
```

Notes:

- `EMBEDDING_SERVICE_URL` must point to the deployed Python service URL.
- `PINECONE_INDEX_HOST` should be host only (no protocol).

### 3) Verify Deployment

Replace `<api-url>` and `<embedding-url>` with your actual Render service URLs.

Health checks:

```bash
curl -s https://<embedding-url>/
curl -s https://<api-url>/
```

Expected: JSON with status fields.

Embedding endpoint:

```bash
curl -s -X POST https://<embedding-url>/embed \
	-H "Content-Type: application/json" \
	-d '{"text":"hello world"}'
```

NER endpoint:

```bash
curl -s -X POST https://<embedding-url>/extract-entities \
	-H "Content-Type: application/json" \
	-d '{"text":"Apple launches new iPhone"}'
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
- `dial tcp ... :8000`: `EMBEDDING_SERVICE_URL` is missing or incorrect
- CORS errors from frontend: set `FRONTEND_ORIGIN` to exact frontend origin

