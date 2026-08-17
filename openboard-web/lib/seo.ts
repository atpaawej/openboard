import type { Metadata } from 'next';
import { siteConfig } from './siteConfig';

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
  keywords?: string[];
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  path = '',
  image = siteConfig.ogImage,
  type = 'website',
  publishedTime,
  authors = [siteConfig.creator],
  keywords = siteConfig.keywords,
}: SeoProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | OpenBoard — Secure Local Open Source Whiteboard`
    : `${siteConfig.name} — ${siteConfig.tagline}`;
  const url = `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: authors.map((name) => ({ name })),
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@atpaawej',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
