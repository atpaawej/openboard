import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { comparisonsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { ComparisonTable } from '@/components/ComparisonTable';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { CopyButton } from '@/components/CopyButton';
import { siteConfig } from '@/lib/siteConfig';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return comparisonsData.map((compare) => ({
    slug: compare.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const compare = comparisonsData.find((c) => c.slug === slug);
  if (!compare) return {};

  return constructMetadata({
    title: `${compare.title} — Comparison & Feature Breakdown`,
    description: compare.summary,
    path: `/compare/${compare.slug}`,
    keywords: [compare.targetKeyword, `openboard vs ${compare.competitor.toLowerCase()}`, 'opensource board', 'secure local white board'],
  });
}

export default async function ComparisonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const compare = comparisonsData.find((c) => c.slug === slug);

  if (!compare) {
    notFound();
  }

  return (
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
          { name: compare.competitor, url: `/compare/${compare.slug}` },
        ]}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08] space-y-4">
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all comparisons</span>
            </Link>

            <SectionHeader
              index={`COMPARE // VS ${compare.competitor.toUpperCase()}`}
              eyebrow="Head-to-Head Comparison"
              eyebrowVariant="blue"
              title={compare.title}
              description={compare.subtitle}
              align="left"
            />
          </div>

          {/* Verdict Box */}
          <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-[#121318] space-y-2">
            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              Executive Verdict
            </div>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-medium">
              {compare.verdict}
            </p>
          </div>

          {/* Capability Matrix */}
          <div className="p-6 sm:p-10 border-b border-white/[0.08] space-y-4 bg-[#0c0d10]">
            <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-tight">
              Detailed Capability Matrix
            </h2>
            <ComparisonTable
              competitorName={compare.competitor}
              features={compare.features}
            />
          </div>

          {/* Pros & Cons 2-Column Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/[0.08]">
            <div className="p-6 sm:p-8 bg-[#121318] border-b md:border-b-0 md:border-r border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <h3 className="font-bold text-sm sm:text-base text-white font-mono uppercase">Why Engineers Choose OpenBoard</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                {compare.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 sm:p-8 bg-[#121318] space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <h3 className="font-bold text-sm sm:text-base text-white font-mono uppercase">{compare.competitor} Limitations</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                {compare.competitorCons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quickstart Callout */}
          <div className="p-8 sm:p-10 text-center space-y-4 bg-[#0c0d10]">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Switch in 30 Seconds with Zero Migration Friction
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Test OpenBoard right in your local terminal. Zero cloud accounts or payment details needed.
            </p>

            <div className="max-w-md mx-auto p-3 rounded bg-[#121318] border border-white/[0.08] flex items-center justify-between font-mono text-xs text-zinc-200">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-blue-400 font-bold">$</span>
                <span>npx openboard-app start</span>
              </div>
              <CopyButton text="npx openboard-app start" label="Copy" />
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                href={siteConfig.githubUrl}
                external
                variant="brand"
                size="md"
                icon={<GithubIcon className="w-4 h-4" />}
              >
                Star on GitHub
              </Button>
              <Button
                href="/docs"
                variant="secondary"
                size="md"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
