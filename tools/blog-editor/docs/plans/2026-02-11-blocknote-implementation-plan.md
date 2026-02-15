# BlockNote Editor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the textarea editor with BlockNote (React) while keeping Markdown file storage and existing Flask AI endpoints.

**Architecture:** Add a Vite + React frontend that runs in a separate dev server and builds static assets for Flask to serve. The editor loads Markdown from the Flask API, converts to BlockNote blocks, and exports Markdown back on save.

**Tech Stack:** Vite, React, BlockNote (Mantine UI), Flask API, Markdown import/export via BlockNote.

### Task 1: Create frontend scaffold and dependencies

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/styles.css`

**Step 1: Write a failing smoke check script**

Create a small Node script that verifies the Vite build output contains `index.html` in the expected directory (it will fail until build is configured).

```js
// frontend/scripts/check-build.js
import fs from "node:fs";
import path from "node:path";

const out = path.resolve(process.cwd(), "dist", "index.html");
if (!fs.existsSync(out)) {
  console.error("Missing build output:", out);
  process.exit(1);
}
console.log("OK:", out);
```

**Step 2: Run the check (expect failure)**

Run: `node frontend/scripts/check-build.js`
Expected: FAIL with missing `dist/index.html`.

**Step 3: Create Vite + React scaffold**

Create a minimal Vite config that sets `build.outDir` to `../static/dist` so Flask can serve it.

```ts
// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "..", "static", "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
```

Add `@blocknote/core`, `@blocknote/react`, `@blocknote/mantine`, `@mantine/core`, `@mantine/hooks`, `@mantine/utils`, `react`, `react-dom`, `vite`, and `@vitejs/plugin-react` dependencies.

**Step 4: Re-run build check**

Run: `cd frontend && npm run build && node scripts/check-build.js`
Expected: PASS with `OK: <...>/static/dist/index.html`.

**Step 5: Commit**

```bash
git add frontend/package.json frontend/vite.config.ts frontend/index.html frontend/src/main.tsx frontend/src/App.tsx frontend/src/styles.css frontend/scripts/check-build.js
git commit -m "chore: add Vite React scaffold for editor"
```

### Task 2: Update Flask to serve built frontend

**Files:**
- Modify: `app.py`
- Modify: `README.md`

**Step 1: Write failing behavior check**

Start Flask and request `/` after removing `static/index.html` (it should fail until we point Flask to `static/dist/index.html`).

Run: `python app.py`
Expected: GET `/` fails if `static/index.html` no longer exists.

**Step 2: Implement new static serving path**

Update Flask `index()` to serve `static/dist/index.html` and fallback to `static/index.html` if needed. Set `static_folder` to `static` and add a route for `/` and `/assets/*` to serve Vite output.

**Step 3: Verify**

Run: `python app.py` then open `/`.
Expected: Vite-built page loads.

**Step 4: Update README**

Add dev instructions:
- Terminal A: `python app.py`
- Terminal B: `cd frontend && npm install && npm run dev`

Add build instructions:
- `cd frontend && npm run build`

**Step 5: Commit**

```bash
git add app.py README.md
git commit -m "chore: serve Vite build output from Flask"
```

### Task 3: BlockNote editor integration and Markdown I/O

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/styles.css`

**Step 1: Write a failing editor load/save test (manual)**

Manual checklist:
- Load an existing article.
- Editor should render content from Markdown.
- Save should update `.md` file.

Initially this will fail because the editor is not wired.

**Step 2: Implement article list + load**

Add API calls to `GET /api/articles` and `GET /api/articles/:slug`. Load frontmatter fields and markdown body.

**Step 3: Convert Markdown to BlockNote blocks**

Use `editor.tryParseMarkdownToBlocks(markdown)` and `editor.replaceBlocks` (or supported API) to set content. Document any lossy conversions in code comments.

**Step 4: Convert BlockNote blocks to Markdown**

On save (manual and debounce), call `editor.blocksToMarkdownLossy()` and send to `PUT /api/articles/:slug` with frontmatter.

**Step 5: Verify manual checklist**

- Open article, edit, save, reload.
Expected: `.md` file updated and content round-trips.

**Step 6: Commit**

```bash
git add frontend/src/App.tsx frontend/src/styles.css
git commit -m "feat: replace textarea editor with BlockNote"
```

### Task 4: Wire AI modal to BlockNote selection

**Files:**
- Modify: `frontend/src/App.tsx`

**Step 1: Write failing manual behavior check**

Manual checklist:
- Select text in editor.
- Run AI action.
- Selection should be replaced.

**Step 2: Implement AI request with selection**

Extract selection text when available, otherwise use full document. Call existing Flask AI endpoints. Replace selection or append/replace full content based on action (same rules as current UI).

**Step 3: Verify**

Test with and without selection and ensure content updates correctly.

**Step 4: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: connect AI actions to BlockNote editor"
```

### Task 5: Clean up and validate

**Files:**
- Remove: `static/index.html` (if no longer used)
- Modify: `README.md`

**Step 1: Verify build**

Run: `cd frontend && npm run build`
Expected: Build completes and `static/dist/index.html` exists.

**Step 2: Run Flask and open UI**

Run: `python app.py`
Expected: UI loads from `static/dist`.

**Step 3: Commit**

```bash
git add static/index.html README.md
git commit -m "chore: remove legacy static editor"
```

Plan complete and saved to `docs/plans/2026-02-11-blocknote-implementation-plan.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
