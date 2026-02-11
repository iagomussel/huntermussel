# BlockNote Editor Integration Design

Date: 2026-02-11

## Summary
Replace the current textarea-based editor with a BlockNote (React) editor, while preserving the existing Flask API and Markdown file storage. The frontend will be rebuilt with Vite + React and run in a separate dev server during development (Option 1). AI integration stays on the current Flask endpoints; the UI will route BlockNote selection/text through those endpoints.

## Goals
- Replace the editor UI with BlockNote.
- Keep Markdown as the persisted format in `src/content/blog/*.md`.
- Keep existing Flask API endpoints and file I/O behavior.
- Preserve current AI integration endpoints and behaviors.
- Keep the current metadata panel and upload flow.

## Non-Goals
- Changing backend storage formats (no JSON persistence).
- Replacing Flask or creating a new backend.
- Building a multi-user or collaborative editor.

## Architecture
- Frontend: Vite + React + BlockNote.
- Backend: Flask (unchanged endpoints), serves API only in dev.
- Dev workflow: Vite dev server for UI, Flask server for API.
- Production workflow: Vite build output is copied to Flask static assets (single server runtime).

Data flow:
1. UI fetches article list from `GET /api/articles`.
2. UI fetches article content from `GET /api/articles/:slug`.
3. Markdown body is converted to BlockNote blocks for editing.
4. On save, blocks are serialized back to Markdown and sent to `PUT /api/articles/:slug`.
5. Flask writes the Markdown to disk and returns status.

## UI Components
- Sidebar: list of articles, create new.
- Top bar: status indicator, save button, AI button, settings button.
- Main editor:
  - Title input (frontmatter: `title`).
  - Subtitle input (frontmatter: `subtitle`).
  - BlockNote editor (body content).
- Settings panel:
  - Slug, date, status, description, tags, cover image.
- AI modal:
  - Uses selection when available; otherwise uses full content.

## BlockNote Integration
- Use BlockNote React editor with Markdown import/export.
- On load:
  - Parse Markdown to BlockNote blocks.
  - Populate editor with those blocks.
- On save:
  - Export blocks to Markdown.
  - Send Markdown body via the existing API payload.

## AI Integration
- Keep existing endpoints (e.g., `/api/ai/improve`).
- Request payload matches current backend expectations.
- Response handling:
  - If selection exists, replace selection.
  - If action is "continue", append response.
  - Otherwise, replace the full document.

## Error Handling
- Save errors show status and leave editor content unchanged.
- AI errors show a toast/alert and do not mutate editor content.
- Markdown parsing failures display a warning and load an empty editor.

## Testing / Validation
- Create a new article and save.
- Edit existing article and verify `.md` file updates.
- Reload and ensure content round-trips (Markdown -> blocks -> Markdown).
- Trigger AI actions and verify content updates match prior behavior.
- Build frontend and verify Flask serves it correctly.

## Open Questions
- None. Proceed with Vite + React + BlockNote, dev server split, Flask for API.
