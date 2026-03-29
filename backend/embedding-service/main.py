import json
import logging
import os
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import spacy
import torch

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Reduce CPU thread fanout for lower memory footprint on small instances.
torch.set_num_threads(1)
torch.set_num_interop_threads(1)

EMBEDDING_MODE = os.getenv("EMBEDDING_MODE", "online").strip().lower()
PRECOMPUTED_EMBEDDINGS_FILE = os.getenv(
    "PRECOMPUTED_EMBEDDINGS_FILE", "/app/embedding-service/precomputed_embeddings.json"
)


def normalize_text(text: str) -> str:
    return " ".join(text.strip().lower().split())


def load_precomputed_embeddings(path: str) -> Dict[str, List[float]]:
    if not os.path.exists(path):
        logger.warning("Precomputed embedding file not found at %s", path)
        return {}

    with open(path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    lookup: Dict[str, List[float]] = {}
    for item in payload.get("items", []):
        key = item.get("key")
        embedding = item.get("embedding")
        if isinstance(key, str) and isinstance(embedding, list):
            lookup[key] = embedding

    logger.info("Loaded %d precomputed embeddings", len(lookup))
    return lookup


model = None
precomputed_lookup: Dict[str, List[float]] = {}

if EMBEDDING_MODE == "online":
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("Embedding mode: online (MiniLM loaded)")
elif EMBEDDING_MODE == "precomputed":
    precomputed_lookup = load_precomputed_embeddings(PRECOMPUTED_EMBEDDINGS_FILE)
    logger.info("Embedding mode: precomputed")
else:
    raise RuntimeError("Invalid EMBEDDING_MODE. Use 'online' or 'precomputed'.")

# Load spaCy NER model for named entity recognition
try:
    ner_model = spacy.load("en_core_web_sm")
    logger.info("spaCy NER model loaded: en_core_web_sm")
except OSError:
    logger.warning("en_core_web_sm not found, downloading on startup")
    import os
    os.system("python -m spacy download en_core_web_sm")
    ner_model = spacy.load("en_core_web_sm")

class TextRequest(BaseModel):
    text: str

@app.get("/")
def health_check():
    return {
        "status": "running",
        "mode": EMBEDDING_MODE,
        "model": "all-MiniLM-L6-v2",
        "precomputed_count": len(precomputed_lookup),
    }

@app.post("/embed")
def embed_text(request: TextRequest):
    if EMBEDDING_MODE == "online":
        embedding = model.encode(request.text).tolist()
        return {"embedding": embedding}

    key = normalize_text(request.text)
    embedding = precomputed_lookup.get(key)
    if embedding is None:
        raise HTTPException(
            status_code=404,
            detail="embedding not found in precomputed cache",
        )

    return {"embedding": embedding}

@app.post("/extract-entities")
def extract_entities(request: TextRequest):
    doc = ner_model(request.text)

    entities = []
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "ORG", "GPE", "PRODUCT", "EVENT"]:
            entities.append({
                "text": ent.text,
                "label": ent.label_
            })

    seen = set()
    unique_entities = []
    for ent in entities:
        if ent["text"] not in seen:
            seen.add(ent["text"])
            unique_entities.append(ent)

    logger.info("Extracted %d entities", len(unique_entities))

    return {
        "entities": unique_entities,
        "text": request.text
    }