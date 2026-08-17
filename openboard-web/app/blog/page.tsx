import React from 'react';
import Link from 'next/link';
import { blogsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { FileText, Clock, Calendar, ArrowRight, User } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Blog & Engineering Knowledge Base',
  description:
    'Deep dives into local-first software architecture, Model Context Protocol (MCP) tooling, open-source whiteboarding, and secure system diagramming for developers.',
  path: '/blog',
});

export default function BlogIndexPage() {
  return (
    <div className="py-16 sm:py-24">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Blog Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Articles &amp; Architecture Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineering Knowledge Base
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Exploring the frontiers of local-first canvases, SQLite data sovereignty, and autonomous AI coding agent workflows.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsData.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="p-6 rounded-2xl bg-[#121318] border border-white/5 hover:border-blue-500/40 hover:bg-[#161720] transition-all flex flex-col justify-between group space-y-5"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors leading-snug">
                  {blog.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-3">
                  {blog.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
