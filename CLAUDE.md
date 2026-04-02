# CLAUDE.md

## Project

Astro + React blog and tools site deployed to Cloudflare Pages.

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run test` — run tests
- `npm run deploy` — build and deploy to Cloudflare Pages
- `npm run upload:assets` — sync `public/images/` and `public/img/` to R2 (uses `.env` `CLOUDFLARE_R2_*`)

Blog posts live in `src/content/blog/` as `.md` files. Cover and inline images use your R2 public URL under `/images/...` (see `CLOUDFLARE_R2_PUBLIC_URL` or `PUBLIC_ASSETS_URL` in `.env`).

## Writing articles

**Before writing or editing any article, read [`ArticleWritingRules.md`](./ArticleWritingRules.md).**

That file defines the editorial voice for this site. The short version: conversational tone, contractions always, open with a problem, no AI-sounding phrases. But read the full rules — they're specific and they matter.

## Branch

Active development happens on `claude/write-claude-tips-article-gPCpU`. Push there.
