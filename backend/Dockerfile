# syntax=docker/dockerfile:1

FROM golang:1.25.8-alpine AS builder
WORKDIR /app

RUN apk add --no-cache git

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /bin/archer-api ./cmd/server

FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# CA certs needed for MongoDB Atlas and Pinecone TLS.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=builder /bin/archer-api /usr/local/bin/archer-api

# Python embedding + NER service dependencies.
COPY embedding-service/requirements.txt /app/embedding-service/requirements.txt
RUN pip install --no-cache-dir -r /app/embedding-service/requirements.txt \
	&& python -m spacy download en_core_web_sm

# Copy runtime files.
COPY embedding-service /app/embedding-service
COPY scripts/start.sh /app/scripts/start.sh

RUN chmod +x /app/scripts/start.sh

ENV PORT=8080
ENV EMBEDDING_INTERNAL_PORT=8000
EXPOSE 8080

CMD ["/app/scripts/start.sh"]
