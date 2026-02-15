# Google Search Console Checklist

Use this checklist to improve and maintain organic traffic for `https://huntermussel.com`.

## 1. Setup and Verification

- [ ] Add property `https://huntermussel.com/` in Google Search Console.
- [ ] Verify ownership using DNS (recommended).
- [ ] Set preferred domain and country target if applicable.

## 2. Sitemap and Crawling

- [ ] Submit sitemap: `https://huntermussel.com/sitemap.xml`.
- [ ] Confirm sitemap status is `Success`.
- [ ] Re-check sitemap after each deploy that adds new blog posts.
- [ ] Inspect `https://huntermussel.com/blog` and one post URL in URL Inspection.

## 3. Indexing Health (Weekly)

- [ ] Open `Pages` report and fix `Crawled - currently not indexed`.
- [ ] Fix `Duplicate without user-selected canonical` using canonical tags.
- [ ] Request indexing for important updated pages.

## 4. Performance and CTR (Weekly)

- [ ] In `Search results`, filter last 28 days.
- [ ] Find queries with position between `8` and `20` and improve those pages first.
- [ ] Find pages with high impressions but low CTR and rewrite title/meta description.
- [ ] Compare mobile vs desktop CTR and position.

## 5. Content Strategy (Monthly)

- [ ] Publish at least 2 quality posts targeting one intent each.
- [ ] Add internal links from each new post to one service page and one related post.
- [ ] Update older posts with fresh examples, dates, and better intros.

## 6. Structured Data

- [ ] Validate homepage Organization schema in Rich Results Test.
- [ ] Validate blog post BlogPosting schema for at least one recent post.
- [ ] Fix warnings/errors before requesting reindex.

## 7. Technical Quality

- [ ] Check Core Web Vitals report for mobile and desktop.
- [ ] Resolve any new `HTTPS` or `Page experience` warnings.
- [ ] Keep `robots.txt` and canonical tags consistent with production URLs.

## 8. Monthly KPI Snapshot

Track these metrics in a sheet:

- Total clicks
- Total impressions
- Average CTR
- Average position
- Top 10 queries by clicks
- Top 10 pages by clicks

## Suggested Workflow for This Repo

1. Publish/update content in `src/content/blog/*.md`.
2. Run `npm run build` to regenerate sitemap and verify compile.
3. Deploy.
4. Submit/inspect changed URLs in Search Console.
