# Humanizer (Ollama) Integration Design

Date: 2026-02-11

## Summary
Add a new Flask endpoint `/api/ai/humanize` that rewrites text via a local Ollama model (`phi3:7b`). Keep the existing `/api/ai/improve` endpoint unchanged. The frontend AI modal will add a “Humanize” action that replaces the current selection (or full document if no selection).

## Goals
- Use a local Ollama model to rewrite text in a more natural style.
- Keep storage and existing AI endpoints intact.
- Return full text (no streaming to the client).

## Non-Goals
- Replace the existing `/api/ai/improve` endpoint.
- Add external API keys or cloud providers.
- Build a streaming UI.

## Architecture
- Backend: Flask endpoint `/api/ai/humanize` calls `http://localhost:11434/api/generate`.
- Model: `phi3:7b` (default).
- Frontend: AI modal adds a “Humanize” action that calls the new endpoint.

Data flow:
1. UI gathers text (selection or full document) and optional style.
2. UI POSTs `{ text, style }` to `/api/ai/humanize`.
3. Flask streams from Ollama internally, concatenates chunks.
4. Flask returns `{ text: "<rewritten>" }` to UI.
5. UI replaces selection or full document with rewritten text.

## API Contract
Request:
```json
{ "text": "...", "style": "natural" }
```

Response:
```json
{ "text": "..." }
```

Errors:
```json
{ "error": "..." }
```

## Error Handling
- If Ollama is unreachable or returns an error, respond with HTTP 500 and `error` field.
- Frontend shows a toast/alert and keeps editor content unchanged.

## Testing / Validation
- Unit test backend: streaming chunk concatenation and prompt formatting.
- Manual test frontend: select text, click Humanize, verify replacement.

## Open Questions
- None.
