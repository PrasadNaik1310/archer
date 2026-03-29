#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

from sentence_transformers import SentenceTransformer


def normalize_text(text: str) -> str:
    return " ".join(text.strip().lower().split())


def load_texts(input_path: Path) -> list[str]:
    payload = json.loads(input_path.read_text(encoding="utf-8"))

    if isinstance(payload, list):
        return [str(x) for x in payload if str(x).strip()]

    if isinstance(payload, dict) and isinstance(payload.get("texts"), list):
        return [str(x) for x in payload["texts"] if str(x).strip()]

    raise ValueError("Input JSON must be a list of strings or {'texts': [...]}.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Precompute MiniLM embeddings for demo mode.")
    parser.add_argument("--input", required=True, help="Path to input JSON with texts")
    parser.add_argument("--output", required=True, help="Path to output JSON file")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    texts = load_texts(input_path)
    unique_texts = []
    seen = set()
    for text in texts:
        key = normalize_text(text)
        if key in seen:
            continue
        seen.add(key)
        unique_texts.append(text)

    model = SentenceTransformer("all-MiniLM-L6-v2")

    items = []
    for text in unique_texts:
        key = normalize_text(text)
        embedding = model.encode(text).tolist()
        items.append({
            "key": key,
            "text": text,
            "embedding": embedding,
        })

    output = {
        "version": 1,
        "items": items,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output), encoding="utf-8")

    print(f"Wrote {len(items)} embeddings to {output_path}")


if __name__ == "__main__":
    main()
