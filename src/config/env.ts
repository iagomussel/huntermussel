interface Environment {
  SITE_URL: string;
  GA_ID?: string;
  SENTRY_DSN?: string;
  N8N_WEBHOOK_URL: string;
}

const env: Environment = {
  SITE_URL: import.meta.env.VITE_SITE_URL || 'https://huntermussel.com',
  GA_ID: import.meta.env.VITE_GA_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://automate.huntermussel.com/webhook/8a534727-8d37-484b-b357-82f33479f291',
};

export default env; 