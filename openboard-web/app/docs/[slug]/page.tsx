import React from 'react';
import { notFound } from 'next/navigation';
import { docsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { DocsLayout } from '@/components/DocsLayout';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return docsData.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const doc = docsData.find((d) => d.slug === slug);
  if (!doc) return {};

  return constructMetadata({
    title: `${doc.title} — Documentation`,
    description: doc.description,
    path: `/docs/${doc.slug}`,
  });
}

export default async function DocDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = docsData.find((d) => d.slug === slug);

  if (!doc) {
    notFound();
  }

  return <DocsLayout currentDoc={doc} />;
}
