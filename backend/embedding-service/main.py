from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import spacy
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Load models ONCE (important)
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load spaCy NER model for named entity recognition
try:
    ner_model = spacy.load("en_core_web_sm")
    logger.info("✅ spaCy NER model loaded: en_core_web_sm")
except OSError:
    logger.warning("⚠️ en_core_web_sm not found, will download on startup")
    import os
    os.system("python -m spacy download en_core_web_sm")
    ner_model = spacy.load("en_core_web_sm")

class TextRequest(BaseModel):
    text: str

@app.get("/")
def health_check():
    return {"status": "running"}

@app.post("/embed")
def embed_text(request: TextRequest):
    embedding = model.encode(request.text).tolist()
    return {"embedding": embedding}

@app.post("/extract-entities")
def extract_entities(request: TextRequest):
    """Extract named entities from text using spaCy NER"""
    doc = ner_model(request.text)
    
    entities = []
    for ent in doc.ents:
        # Extract PERSON, ORG, GPE, PRODUCT, EVENT entity types
        if ent.label_ in ["PERSON", "ORG", "GPE", "PRODUCT", "EVENT"]:
            entities.append({
                "text": ent.text,
                "label": ent.label_
            })
    
    # Remove duplicates while preserving order
    seen = set()
    unique_entities = []
    for ent in entities:
        if ent["text"] not in seen:
            seen.add(ent["text"])
            unique_entities.append(ent)
    
    logger.info(f"Extracted {len(unique_entities)} entities from text")
    
    return {
        "entities": unique_entities,
        "text": request.text
    }