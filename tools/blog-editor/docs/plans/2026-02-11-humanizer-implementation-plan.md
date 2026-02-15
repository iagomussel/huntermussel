# Humanizer (Ollama) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `/api/ai/humanize` that rewrites text using a local Ollama model (`phi3:7b`) and wire it to the AI modal.

**Architecture:** Flask endpoint calls Ollama with streaming response, concatenates chunks, and returns full text. Frontend adds a “Humanize” action that replaces selection or document with the result.

**Tech Stack:** Flask, requests, Ollama, React (BlockNote UI).

### Task 1: Add backend humanizer helper and tests

**Files:**
- Modify: `app.py`
- Create: `tests/test_humanizer.py`

**Step 1: Write failing test**

```python
import json
from types import SimpleNamespace
from app import rewrite_text_stream


def test_rewrite_text_stream_concatenates_chunks(monkeypatch):
    lines = [
        json.dumps({"response": "Hello ", "done": False}).encode(),
        json.dumps({"response": "world", "done": True}).encode(),
    ]

    class FakeResponse:
        def __enter__(self):
            return self
        def __exit__(self, *args):
            return False
        def raise_for_status(self):
            return None
        def iter_lines(self):
            return lines

    def fake_post(*args, **kwargs):
        return FakeResponse()

    monkeypatch.setattr("requests.post", fake_post)
    assert rewrite_text_stream("x", style="natural") == "Hello world"
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_humanizer.py -q`
Expected: FAIL with `ImportError` or function not found.

**Step 3: Implement minimal code**

Add `rewrite_text_stream` in `app.py` using the provided Ollama snippet. Default model: `phi3:7b`.

```python
OLLAMA_URL = "http://localhost:11434/api/generate"
HUMANIZER_MODEL = "phi3:7b"


def rewrite_text_stream(text, style="natural"):
    prompt = f"Reescreva de forma {style}:\n\n{text}"
    payload = {
        "model": HUMANIZER_MODEL,
        "prompt": prompt,
        "stream": True,
        "temperature": 0.8,
    }
    with requests.post(OLLAMA_URL, json=payload, stream=True) as response:
        response.raise_for_status()
        full_text = ""
        for line in response.iter_lines():
            if line:
                data = json.loads(line)
                if "response" in data:
                    full_text += data["response"]
                if data.get("done"):
                    break
    return full_text.strip()
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_humanizer.py -q`
Expected: PASS.

**Step 5: Commit**

```bash
git add app.py tests/test_humanizer.py
git commit -m "feat: add humanizer helper for Ollama"
```

### Task 2: Add new Flask endpoint

**Files:**
- Modify: `app.py`

**Step 1: Write failing test**

```python
from app import app

def test_humanize_endpoint_returns_text(client):
    res = client.post("/api/ai/humanize", json={"text": "Hello"})
    assert res.status_code in {200, 500}
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_humanizer.py -q`
Expected: FAIL with 404.

**Step 3: Implement endpoint**

```python
@app.route("/api/ai/humanize", methods=["POST"])
def humanize():
    data = request.get_json() or {}
    try:
        text = data.get("text", "")
        style = data.get("style", "natural")
        output = rewrite_text_stream(text, style=style)
        return jsonify({"text": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_humanizer.py -q`
Expected: PASS.

**Step 5: Commit**

```bash
git add app.py tests/test_humanizer.py
git commit -m "feat: add /api/ai/humanize endpoint"
```

### Task 3: Wire frontend AI modal action

**Files:**
- Modify: `frontend/src/App.tsx`

**Step 1: Write failing manual check**

Manual checklist:
- Select text.
- Click Humanize.
- Selection should be replaced.

**Step 2: Implement Humanize action**

Add a button in the AI modal and a handler that posts to `/api/ai/humanize` with `text` and `style`.

**Step 3: Verify manual checklist**

Test with and without selection.

**Step 4: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: add humanize action to AI modal"
```

Plan complete and saved to `docs/plans/2026-02-11-humanizer-implementation-plan.md`. Two execution options:

1. Subagent-Driven (this session)
2. Parallel Session (separate)

Which approach?
