import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { comparisonsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema, FaqSchema } from '@/components/JsonLd';
import { ComparisonTable } from '@/components/ComparisonTable';
import { FaqSection } from '@/components/FaqSection';
import { ArrowLeft, CheckCircle, XCircle, Sparkles, Shield, Star } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { CopyButton } from '@/components/CopyButton';
import { siteConfig } from '@/lib/siteConfig';

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
    <div className="py-12 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare/openboard-vs-excalidraw' },
          { name: compare.competitor, url: `/compare/${compare.slug}` },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Head-to-Head Comparison</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {compare.title}
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {compare.subtitle}
          </p>
        </header>

        {/* Verdict Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-blue-500/40 shadow-xl space-y-3">
          <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
            Executive Summary &amp; Verdict
          </div>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
            {compare.verdict}
          </p>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Detailed Capability Matrix
          </h2>
          <ComparisonTable
            competitorName={compare.competitor}
            features={compare.features}
          />
        </div>

        {/* Pros & Cons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* OpenBoard Strengths */}
          <div className="p-6 rounded-2xl bg-[#121318] border border-emerald-500/30 space-y-4">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Why Choose OpenBoard?</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              {compare.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitor Limitations */}
          <div className="p-6 rounded-2xl bg-[#121318] border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-gray-300 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span>{compare.competitor} Considerations</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              {compare.competitorCons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-6">
          <FaqSection faqs={compare.faqs} />
        </div>

        {/* Quickstart Call to Action */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-[#14151e] to-[#0d0e13] border border-white/10 text-center space-y-5">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Experience the Local-First Difference
          </h3>
          <p className="text-gray-300 text-sm max-w-xl mx-auto">
            Zero cloud subscriptions. Zero telemetry. Instant launch with npx.
          </p>
          <div className="max-w-md mx-auto p-3 rounded-lg bg-[#0c0d10] border border-white/10 flex items-center justify-between font-mono text-xs text-gray-200">
            <span>npx openboard-app start</span>
            <CopyButton text="npx openboard-app start" label="Copy" />
          </div>
          <div className="pt-2 flex justify-center">
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 active:scale-[0.98] transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Star atpaawej/openboard on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
