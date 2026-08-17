import React from 'react';
import { siteConfig } from '@/lib/siteConfig';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpenBoard',
    alternateName: ['OpenBoard Workspace', 'Open Source Board', 'OpenBoard Local Whiteboard'],
    operatingSystem: 'Cross-platform (macOS, Linux, Windows)',
    applicationCategory: 'DeveloperApplication, ProductivityApplication, DesignApplication',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    description:
      'Local-first personal whiteboard workspace for developers and autonomous AI agents. Features 13 Model Context Protocol (MCP) tools, local SQLite storage, zero cloud dependencies, and zero telemetry.',
    url: siteConfig.url,
    downloadUrl: siteConfig.npmUrl,
    softwareVersion: '0.1.4',
    license: 'https://opensource.org/licenses/MIT',
    author: {
      '@type': 'Person',
      name: siteConfig.creator,
      url: siteConfig.links.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OpenBoard Open Source Project',
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.svg`,
      sameAs: [
        siteConfig.githubUrl,
        siteConfig.npmUrl,
      ],
    },
    featureList: [
      '100% Local-First and Private SQLite database storage (~/.openboard/openboard.db)',
      'Model Context Protocol (MCP) Stdio and SSE server with 13 semantic tools',
      'AI Agent Native integration for Claude Code, Cursor, Codex, OpenCode, Hermes',
      'Interactive infinite canvas powered by tldraw with near-black Twenty-inspired aesthetic',
      'Headless canvas inspection and instant pixel-perfect SVG vector rendering',
      'Real-time live browser projection via Server-Sent Events (SSE)',
      'Zero cloud dependencies, zero account requirements, zero telemetry tracking'
    ],
    screenshot: `${siteConfig.url}/dashboard.png`,
    storageRequirements: 'Node.js 18+, <50MB disk space for local SQLite',
  };

  return <JsonLd data={schema} />;
}

export function FaqSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={schema} />;
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
    })),
  };

  return <JsonLd data={schema} />;
}

export function TechArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  url,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    image: `${siteConfig.url}/og.png`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: siteConfig.creator,
      url: siteConfig.links.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OpenBoard',
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.svg`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}${url.startsWith('/') ? url : `/${url}`}`,
    },
  };

  return <JsonLd data={schema} />;
}
