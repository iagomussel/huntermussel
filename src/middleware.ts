/**
 * Middleware to redirect www to non-www with 301 permanent redirect
 * This ensures canonical URL consistency for SEO
 */
export const onRequest = ({ request, redirect }) => {
  const url = new URL(request.url);
  
  // Only redirect www subdomain to non-www
  if (url.hostname.startsWith('www.')) {
    const nonWwwUrl = new URL(url);
    nonWwwUrl.hostname = url.hostname.replace(/^www\./, '');
    return redirect(nonWwwUrl.toString(), 301);
  }
};
