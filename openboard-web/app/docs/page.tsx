import React from 'react';
import { docsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { DocsLayout } from '@/components/DocsLayout';

export const metadata = constructMetadata({
  title: 'Documentation & Guides',
  description:
    'Complete documentation for OpenBoard. Learn how to launch via npx, integrate with Claude Code and Cursor via MCP, and leverage the local SQLite architecture.',
  path: '/docs',
});

export default function DocsIndexPage() {
  const defaultDoc = docsData[0]; // Quickstart guide

  return <DocsLayout currentDoc={defaultDoc} />;
}
