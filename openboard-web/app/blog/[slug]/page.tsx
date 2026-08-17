import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema, TechArticleSchema } from '@/components/JsonLd';
import { ArrowLeft, Clock, Calendar, User, Tag, Sparkles } from 'lucide-react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { CopyButton } from '@/components/CopyButton';
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
    <div className="py-12 sm:py-16">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 pb-8 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-950/50 text-blue-300 border border-blue-500/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-normal">
            {blog.summary}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 font-mono pt-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-xs">
                ✦
              </div>
              <span className="text-gray-200 font-semibold">{blog.author}</span>
              <span className="text-gray-500">({blog.authorRole})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>{blog.publishedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </header>

        {/* Article Body using MarkdownContent */}
        <article className="pt-8">
          <MarkdownContent content={blog.content} />
        </article>

        {/* Post-article Call to Action Box */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-[#121318] border border-blue-500/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Launch OpenBoard Locally</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            OpenBoard is 100% free and open-source under the MIT license. Launch it immediately in your terminal with zero configuration:
          </p>
          <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-white/10 flex items-center justify-between font-mono text-xs sm:text-sm text-gray-200">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-emerald-400 font-bold">$</span>
              <span>npx openboard-app start</span>
            </div>
            <CopyButton text="npx openboard-app start" label="Copy" />
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              href="/docs/quickstart"
              variant="primary"
              size="sm"
            >
              Get Started with Quickstart
            </Button>
            <Button
              href="/compare"
              variant="secondary"
              size="sm"
            >
              Compare with Alternatives
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
