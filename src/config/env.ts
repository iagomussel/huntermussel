interface Environment {
  SITE_URL: string;
  GA_ID?: string;
  SENTRY_DSN?: string;
}

const env: Environment = {
  SITE_URL: import.meta.env.VITE_SITE_URL || 'https://odontomaster.com.br',
  GA_ID: import.meta.env.VITE_GA_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
};

export default env; 