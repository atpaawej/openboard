import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { integrationsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { ArrowLeft, Check, Terminal, Code, Laptop, Sparkles } from 'lucide-react';
import { CopyButton } from '@/components/CopyButton';
import { siteConfig } from '@/lib/siteConfig';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return integrationsData.map((integ) => ({
    slug: integ.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const integ = integrationsData.find((i) => i.slug === slug);
  if (!integ) return {};

  return constructMetadata({
    title: `${integ.title} | OpenBoard Integration`,
    description: integ.description,
    path: `/integrations/${integ.slug}`,
    keywords: [`${integ.name.toLowerCase()} whiteboard`, `${integ.name.toLowerCase()} mcp`, 'openboard', 'model context protocol'],
  });
}

export default async function IntegrationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const integ = integrationsData.find((i) => i.slug === slug);

  if (!integ) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Integrations', url: '/integrations/claude-code' },
          { name: integ.name, url: `/integrations/${integ.slug}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

        {/* Integration Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{integ.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {integ.title}
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {integ.description}
          </p>
        </header>

        {/* Configuration JSON Box */}
        <div className="rounded-2xl bg-[#121318] border border-white/10 p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Configuration File Snippet</span>
            <CopyButton text={integ.configJson} label="Copy JSON" />
          </div>
          <pre className="p-4 rounded-xl bg-[#0c0d10] border border-white/10 font-mono text-xs sm:text-sm text-blue-300 overflow-x-auto">
            <code>{integ.configJson}</code>
          </pre>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Step-by-Step Setup Guide
          </h2>
          <div className="space-y-4">
            {integ.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#121318] border border-white/5 space-y-3"
              >
                <h3 className="text-base font-bold text-gray-100">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {step.detail}
                </p>
                {step.command && (
                  <div className="p-3 rounded-lg bg-[#0c0d10] border border-white/10 flex items-center justify-between font-mono text-xs text-gray-200">
                    <span className="overflow-x-auto">$ {step.command}</span>
                    <CopyButton text={step.command} label="Copy" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Integration Capabilities */}
        <div className="p-6 rounded-2xl bg-[#121318] border border-white/5 space-y-4">
          <h3 className="text-lg font-bold text-white">What You Can Do</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
            {integ.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">✦</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
