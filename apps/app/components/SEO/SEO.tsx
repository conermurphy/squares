import React from 'react';
import Head from 'next/head';

interface IProps {
  metaTitle: string;
  metaDescription: string;
  metaImage?: string;
  url?: string;
  article?: boolean;
  authorTwitterHandle?: string;
  canonicalUrl?: string;
  date?: string;
}

export default function SEO({
  metaTitle,
  metaDescription,
  metaImage = '',
  url = '',
  article = false,
  authorTwitterHandle = '@MrConerMurphy',
  canonicalUrl = '',
  date = '',
}: IProps) {
  const absoluteUrl = `/${url}`;
  const image = metaImage ? `${metaImage}` : `/favicon.png`;
  const title = metaTitle ? `${metaTitle} | Squares` : 'Squares';

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl || absoluteUrl} />

      <meta name="image" content={image} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={metaDescription} />

      <meta name="og:title" content={title} />
      <meta name="og:description" content={metaDescription} />
      <meta name="generator" content="Squares" />
      <meta name="og:type" content={article ? 'article' : 'website'} />
      <meta name="og:image" content={image} />
      <meta name="og:image:alt" content={metaTitle} />
      <meta name="og:url" content={absoluteUrl} />
      <meta property="og:site_name" content="Squares" />
      {date ? (
        <meta
          property="article:published_time"
          content={new Date(date).toISOString()}
        />
      ) : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={authorTwitterHandle} />
      <meta name="twitter:site" content={authorTwitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={metaTitle} />
    </Head>
  );
}
