import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({ title, description, image, url }: SEOProps) => (
  <Helmet>
    <title>{title} | Hunter Mussel</title>
    <meta name="description" content={description} />
    {image && <meta property="og:image" content={image} />}
    {url && <meta property="og:url" content={url} />}
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </Helmet>
);

export default SEO;
