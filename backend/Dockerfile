# syntax=docker/dockerfile:1

FROM golang:1.23-alpine AS builder
WORKDIR /app

# Install git for module downloads if needed
RUN apk add --no-cache git

# Copy go module files first for better caching
COPY go.mod ./
RUN go mod download

# Copy source and build binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /bin/archer-api ./cmd/server

FROM alpine:3.20
WORKDIR /app

# CA certs for Atlas/Pinecone TLS
RUN apk add --no-cache ca-certificates

COPY --from=builder /bin/archer-api /usr/local/bin/archer-api

ENV PORT=8080
EXPOSE 8080

CMD ["/usr/local/bin/archer-api"]
