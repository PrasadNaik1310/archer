from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()

# Load model ONCE (important)
model = SentenceTransformer("all-MiniLM-L6-v2")

class TextRequest(BaseModel):
    text: str

@app.get("/")
def health_check():
    return {"status": "running"}

@app.post("/embed")
def embed_text(request: TextRequest):
    embedding = model.encode(request.text).tolist()
       
    return {
        "embedding": embedding
     
    }