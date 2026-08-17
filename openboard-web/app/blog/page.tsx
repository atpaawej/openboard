import React from 'react';
import Link from 'next/link';
import { blogsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { Clock, User } from 'lucide-react';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialGrid } from '@/components/ui/EditorialGrid';
import { ContentCell } from '@/components/ui/ContentCell';

export const metadata = constructMetadata({
  title: 'Blog & Engineering Knowledge Base',
  description:
    'Deep dives into local-first software architecture, Model Context Protocol (MCP) tooling, open-source whiteboarding, and secure system diagramming for developers.',
  path: '/blog',
});

export default function BlogIndexPage() {
  return (
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ]}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="px-6 py-12 sm:px-10 border-b border-white/[0.08]">
            <SectionHeader
              index="ARTICLES // GUIDES"
              eyebrow="Architecture &amp; MCP Deep Dives"
              eyebrowVariant="blue"
              title="Engineering Knowledge Base"
              description="Exploring the frontiers of local-first canvases, SQLite data sovereignty, and autonomous AI coding agent workflows."
              align="left"
            />
          </div>

          {/* Connected Blog Editorial Grid */}
          <EditorialGrid composition="4-4-4" withOuterBorder={false}>
            {blogsData.map((blog, idx) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="block group h-full"
              >
                <ContentCell
                  metadata={`0${idx + 1} // ${blog.tags[0]?.toUpperCase() || 'ARTICLE'}`}
                  badge={blog.readTime}
                  badgeVariant="mono"
                  title={blog.title}
                  description={blog.summary}
                  withBorderRight={idx % 3 !== 2}
                  withBorderBottom={idx < blogsData.length - (blogsData.length % 3 || 3)}
                  padding="lg"
                  variant="interactive"
                  action={
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{blog.author}</span>
                      </div>
                      <span className="text-blue-400 font-semibold group-hover:underline">
                        Read →
                      </span>
                    </div>
                  }
                />
              </Link>
            ))}
          </EditorialGrid>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
