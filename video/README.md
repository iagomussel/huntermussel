# Blog → Branded Video (Remotion)

This `video/` package renders short branded promo videos from the Astro blog posts in `../src/content/blog`.

## Render a post

From the repo root:

```bash
cd video
npm run render:blog -- --slug claude-tips-github-repos-you-should-know
```

Portrait / IG format:

```bash
cd video
npm run render:blog -- --slug claude-tips-github-repos-you-should-know --format portrait
```

Output is written to `video/out/`.

## Narration (ElevenLabs)

Create `video/.env` (gitignored) from `video/.env.example`:

```bash
cd video
cp .env.example .env
```

Then set:

- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`

By default, `npm run render:blog ...` generates `video/public/voiceover/<slug>.mp3` and includes it in the render.
To disable narration, pass `--no-narration`.

## Branding

Edit `video/brand.json`.

## Notes

- Blog cover URLs in site frontmatter now point at `https://assets.huntermussel.com/images/blog/...`. For Remotion, keep local files under `video/public/blog/` (e.g. `blog/foo.webp`) or adjust your ingest script if it used to read relative `/images/` paths.
- If you want a different layout / animation style, edit `video/src/blog/BlogPromo.tsx`.
