import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { integrationsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { ArrowLeft } from 'lucide-react';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { CodeSnippet } from '@/components/ui/CodeSnippet';
import { Button } from '@/components/ui/Button';

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
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Integrations', url: '/integrations/claude-code' },
          { name: integ.name, url: `/integrations/${integ.slug}` },
        ]}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08] space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>

            <SectionHeader
              index={`INTEGRATION // ${integ.name.toUpperCase()}`}
              eyebrow={integ.badge}
              eyebrowVariant="blue"
              title={integ.title}
              description={integ.description}
              align="left"
            />
          </div>

          {/* Configuration JSON Box */}
          <div className="p-6 sm:p-10 border-b border-white/[0.08] space-y-2 bg-[#0c0d10]">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Server Configuration File (JSON):
            </div>
            <CodeSnippet code={integ.configJson} language="json" filename="mcp-server-config.json" />
          </div>

          {/* Step-by-Step Guide */}
          <div className="p-6 sm:p-10 border-b border-white/[0.08] space-y-6 bg-[#0c0d10]">
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-tight">
              Step-by-Step Setup Guide
            </h2>
            <div className="space-y-4">
              {integ.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded bg-[#121318] border border-white/[0.08] space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#181920] border border-blue-500/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-sm sm:text-base text-white">{step.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-8">{step.detail}</p>
                  {step.command && (
                    <div className="pl-8 pt-1">
                      <CodeSnippet code={step.command} language="bash" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-8 sm:p-10 text-center space-y-4 bg-[#0c0d10]">
            <h3 className="text-xl font-bold text-white font-mono uppercase">
              Need help or additional custom tooling?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Check the complete reference for all 13 semantic Model Context Protocol tools.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button href="/docs/mcp-tools" variant="brand" size="sm">
                Explore 13 MCP Tools
              </Button>
              <Button href="/docs/quickstart" variant="secondary" size="sm">
                Quickstart Guide
              </Button>
            </div>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
