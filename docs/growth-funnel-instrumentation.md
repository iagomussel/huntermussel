# Growth Funnel Instrumentation

This site now emits a minimal lead-generation funnel through the shared client analytics layer in `src/lib/analytics.ts`.

## Tracking Stack

- Google Tag Manager container: `GTM-K8THDL4C`
- Transport: `window.dataLayer.push(...)`
- Shared bootstrap: `src/components/AnalyticsBootstrap.astro`
- Shared layouts: `src/layouts/Layout.astro`, `src/layouts/BaseLayout.astro`

## Attribution Model

Each event includes:

- `page_path`
- `page_title`
- `page_url`
- `page_category`
- `session_id`
- `first_touch_source`
- `first_touch_medium`
- `first_touch_campaign`
- `first_touch_landing_path`
- `latest_touch_source`
- `latest_touch_medium`
- `latest_touch_campaign`
- `latest_touch_referrer_host`
- `latest_touch_landing_path`

Attribution rules:

- First touch is stored in `localStorage`.
- Latest session touch is stored in `sessionStorage`.
- External referrers are classified as `organic` for known search engines and `referral` otherwise.
- No campaign params and no external referrer falls back to `direct / none`.

## Event Taxonomy

Core funnel events:

- `hm_page_view`
  - Fired once per page load from the shared bootstrap.
- `lead_cta_click`
  - Fired for contact-intent CTAs such as hero, navbar, footer, `/contact`, and `/#contact` links.
  - Extra params: `cta_label`, `cta_location`, `destination`
- `contact_form_started`
  - Fired once when a visitor first interacts with the contact form.
  - Extra params: `form_id`, `form_surface`
- `contact_form_submit`
  - Fired on form submission attempt.
  - Extra params: `form_id`, `form_surface`, `has_phone`, `message_length_bucket`
- `contact_form_success`
  - Fired after a successful contact form response.
  - Extra params: `form_id`, `form_surface`
- `contact_form_error`
  - Fired when the form fails.
  - Extra params: `form_id`, `form_surface`, `error_type`
- `scheduler_embed_ready`
  - Fired when the Cal embed is ready.
  - Extra params: `scheduler_vendor`, `scheduler_surface`
- `scheduler_embed_view`
  - Fired when the scheduler becomes viewable or Cal emits `bookerViewed`.
  - Extra params: `scheduler_vendor`, `scheduler_surface`
- `scheduler_open_external`
  - Fired when the "Open in Cal" link is clicked.
  - Extra params: `cta_label`, `cta_location`, `destination`
- `scheduler_booking_success`
  - Fired when Cal emits `bookingSuccessfulV2`.
  - Extra params: `scheduler_vendor`, `scheduler_surface`
- `scheduler_embed_error`
  - Fired when Cal reports a link failure.
  - Extra params: `scheduler_vendor`, `scheduler_surface`
- `contact_channel_click`
  - Fired for direct email and WhatsApp clicks.
  - Extra params: `contact_channel`, `cta_label`, `cta_location`, `destination`
- `generate_lead`
  - Fired for confirmed lead conversions:
    - successful contact form submission
    - successful Cal booking

## First Reporting View

Build the first GA4 funnel or GTM-backed reporting view with this sequence:

1. `hm_page_view`
2. `lead_cta_click`
3. `contact_form_submit` or `scheduler_open_external` or `contact_channel_click`
4. `generate_lead`

Primary breakdowns:

- `latest_touch_source`
- `latest_touch_medium`
- `page_category`
- `cta_location`
- `form_surface`

Primary outcome questions:

- Which landing pages produce the most lead-intent clicks?
- Which traffic sources drive the most `generate_lead` events?
- What is the drop-off between `lead_cta_click` and `contact_form_submit`?
- Are leads converting more via the form or via scheduled calls?

## Implementation Notes

- The previous duplicate direct GA snippet was removed from `BaseLayout.astro` so measurement stays consistent through GTM.
- Tools pages and marketing pages now share the same analytics bootstrap path.
- Contact form analytics avoid sending PII; only non-sensitive metadata is tracked.
