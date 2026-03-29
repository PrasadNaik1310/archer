#!/usr/bin/env python3
import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


def load_texts(input_path: Path) -> list[str]:
    payload = json.loads(input_path.read_text(encoding="utf-8"))

    if isinstance(payload, list):
        return [str(x).strip() for x in payload if str(x).strip()]

    if isinstance(payload, dict) and isinstance(payload.get("texts"), list):
        return [str(x).strip() for x in payload["texts"] if str(x).strip()]

    raise ValueError("Input JSON must be a list of strings or {'texts': [...]}.")


def post_ingest(api_base_url: str, text: str, timeout_seconds: int) -> tuple[int, str]:
    body = json.dumps({"text": text}).encode("utf-8")
    req = urllib.request.Request(
        url=f"{api_base_url.rstrip('/')}/ingest",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout_seconds) as resp:
            payload = resp.read().decode("utf-8")
            return resp.status, payload
    except urllib.error.HTTPError as e:
        payload = e.read().decode("utf-8") if e.fp else ""
        return e.code, payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Bulk-ingest seed texts into Archer backend.")
    parser.add_argument("--api-url", required=True, help="Base API URL, e.g. https://archer-8qzm.onrender.com")
    parser.add_argument("--input", required=True, help="Path to JSON file with texts")
    parser.add_argument("--delay-ms", type=int, default=250, help="Delay between requests in milliseconds")
    parser.add_argument("--timeout", type=int, default=30, help="Request timeout in seconds")
    args = parser.parse_args()

    input_path = Path(args.input)
    texts = load_texts(input_path)

    ok = 0
    fail = 0

    for idx, text in enumerate(texts, start=1):
        status, payload = post_ingest(args.api_url, text, args.timeout)
        if 200 <= status < 300:
            ok += 1
            print(f"[{idx}/{len(texts)}] OK {status}: {text}")
        else:
            fail += 1
            print(f"[{idx}/{len(texts)}] FAIL {status}: {text} :: {payload}")

        if idx != len(texts):
            time.sleep(max(args.delay_ms, 0) / 1000.0)

    print(f"Done. success={ok}, failed={fail}, total={len(texts)}")

    if fail > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
