import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema, TechArticleSchema } from '@/components/JsonLd';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { CopyButton } from '@/components/CopyButton';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogsData.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const blog = blogsData.find((b) => b.slug === slug);
  if (!blog) return {};

  return constructMetadata({
    title: blog.title,
    description: blog.summary,
    path: `/blog/${blog.slug}`,
    type: 'article',
    publishedTime: blog.publishedDate,
    authors: [blog.author],
    keywords: [blog.targetKeyword, ...blog.tags, 'openboard'],
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = blogsData.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: blog.title, url: `/blog/${blog.slug}` },
        ]}
      />
      <TechArticleSchema
        title={blog.title}
        description={blog.summary}
        datePublished={blog.publishedDate}
        url={`/blog/${blog.slug}`}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="md" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="p-6 sm:p-10 border-b border-white/[0.08] space-y-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all articles</span>
            </Link>

            <div className="flex flex-wrap gap-2 pt-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="blue">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {blog.title}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
              {blog.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-mono pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-zinc-200 font-semibold">{blog.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{blog.publishedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <article className="p-6 sm:p-10 border-b border-white/[0.08]">
            <MarkdownContent content={blog.content} />
          </article>

          {/* Bottom Actions */}
          <div className="p-6 sm:p-10 bg-[#121318] text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-white font-mono uppercase">
              Try OpenBoard on Your Machine
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              100% Free, local-first in SQLite, and zero cloud lock-in.
            </p>
            <div className="max-w-xs mx-auto p-2.5 rounded bg-[#0c0d10] border border-white/[0.08] flex items-center justify-between font-mono text-xs text-zinc-200">
              <span>$ npx openboard-app start</span>
              <CopyButton text="npx openboard-app start" label="Copy" />
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Button href="/docs/quickstart" variant="brand" size="sm">
                Get Started
              </Button>
              <Button href="/blog" variant="secondary" size="sm">
                More Articles
              </Button>
            </div>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
