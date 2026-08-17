import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { FeatureGrid } from '@/components/FeatureGrid';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { McpConfigGenerator } from '@/components/McpConfigGenerator';
import { McpToolMatrix } from '@/components/McpToolMatrix';
import { ComparisonTable } from '@/components/ComparisonTable';
import { FaqSection } from '@/components/FaqSection';
import { comparisonsData, homeFaqs } from '@/lib/content';
import { siteConfig } from '@/lib/siteConfig';
import { Star, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { CopyButton } from '@/components/CopyButton';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { EditorialGrid } from '@/components/ui/EditorialGrid';
import { ContentCell } from '@/components/ui/ContentCell';

export default function HomePage() {
  const excalidrawCompare = comparisonsData.find((c) => c.slug === 'openboard-vs-excalidraw');

  return (
    <div className="space-y-0 bg-[#0c0d10]">
      {/* 01. Hero Section */}
      <Hero />

      {/* 02. Problem vs Solution Narrative */}
      <FeatureGrid />

      {/* 03. Air-Gapped Local System Topology */}
      <ArchitectureDiagram />

      {/* 04. Interactive MCP Configuration Generator */}
      <McpConfigGenerator />

      {/* 05. 13 Semantic MCP Tools Matrix */}
      <McpToolMatrix />

      {/* 06. Comparison Section */}
      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08]">
            <SectionHeader
              index="06 // COMPARISON"
              eyebrow="Objective Analysis"
              eyebrowVariant="blue"
              title="OpenBoard vs Legacy Whiteboards"
              description="See why software architects and AI practitioners switch from cloud SaaS to local-first SQLite whiteboarding."
              align="left"
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-[#0c0d10]">
            {excalidrawCompare && (
              <ComparisonTable
                competitorName="Excalidraw"
                features={excalidrawCompare.features}
                compareSlug="openboard-vs-excalidraw"
              />
            )}

            {/* Quick links to other comparison guides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link
                href="/compare/openboard-vs-miro"
                className="p-5 rounded bg-[#121318] border border-white/[0.08] hover:border-blue-500/40 hover:bg-[#161722] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white">
                    OpenBoard vs Miro
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    100% Private, Zero Cloud Subscriptions &amp; Zero Telemetry
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/compare/openboard-vs-tldraw"
                className="p-5 rounded bg-[#121318] border border-white/[0.08] hover:border-blue-500/40 hover:bg-[#161722] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white">
                    OpenBoard vs tldraw
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Full Workspace &amp; 13-Tool MCP Server vs Raw Canvas SDK
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </TechnicalFrame>
      </SectionFrame>

      {/* 07. Engineering Knowledge Base Highlights */}
      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08]">
            <SectionHeader
              index="07 // KNOWLEDGE BASE"
              eyebrow="Engineering Deep Dives"
              eyebrowVariant="blue"
              title="Latest Articles on Local-First &amp; AI Whiteboarding"
              description="Architectural deep-dives on local SQLite persistence, MCP protocols, and agent diagramming."
              align="left"
              action={
                <Link
                  href="/blog"
                  className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>View all articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
          </div>

          <EditorialGrid composition="4-4-4" withOuterBorder={false}>
            <Link
              href="/blog/why-local-first-whiteboards-matter"
              className="block group h-full"
            >
              <ContentCell
                metadata="01 // SECURITY"
                badge="SQLite Architecture"
                badgeVariant="blue"
                title="Why Local-First Whiteboards are the Future of Secure Engineering"
                description="Discover why top engineering teams are ditching cloud subscriptions for 100% private, local SQLite-backed infinite canvases."
                withBorderRight
                withBorderBottom={false}
                padding="lg"
                variant="interactive"
                action={
                  <span className="text-xs font-mono text-blue-400 group-hover:underline">
                    Read article (5 min) →
                  </span>
                }
              />
            </Link>

            <Link
              href="/blog/open-source-whiteboard-guide"
              className="block group h-full"
            >
              <ContentCell
                metadata="02 // OPEN SOURCE"
                badge="Developer Guide"
                badgeVariant="success"
                title="Open Source Board: The Developer's Guide to 100% Private Collaboration"
                description="Everything you need to know about choosing, deploying, and building with open-source whiteboard workspaces without SaaS lock-in."
                withBorderRight
                withBorderBottom={false}
                padding="lg"
                variant="interactive"
                action={
                  <span className="text-xs font-mono text-blue-400 group-hover:underline">
                    Read article (6 min) →
                  </span>
                }
              />
            </Link>

            <Link
              href="/blog/supercharge-ai-coding-agents-with-mcp"
              className="block group h-full"
            >
              <ContentCell
                metadata="03 // AI AGENTS"
                badge="Model Context Protocol"
                badgeVariant="blue"
                title="Supercharging AI Coding Agents with Model Context Protocol (MCP)"
                description="Learn how to give Claude Code, Cursor, and Codex the superpower of visual architecture diagramming through 13 semantic tools."
                withBorderRight={false}
                withBorderBottom={false}
                padding="lg"
                variant="interactive"
                action={
                  <span className="text-xs font-mono text-blue-400 group-hover:underline">
                    Read article (7 min) →
                  </span>
                }
              />
            </Link>
          </EditorialGrid>
        </TechnicalFrame>
      </SectionFrame>

      {/* 08. Frequently Asked Questions */}
      <FaqSection faqs={homeFaqs} />

      {/* 09. Bottom CTA Frame */}
      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          <div className="p-8 sm:p-14 text-center space-y-6">
            <div className="inline-flex items-center justify-center">
              <span className="text-xs font-mono px-3 py-1 rounded bg-[#181920] border border-white/[0.10] text-zinc-300">
                09 // START • MIT LICENSE • 100% FREE FOREVER
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Start Diagramming in Seconds
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
              No signup, no telemetry, no payment details. Run one command to launch your private local whiteboard.
            </p>

            <div className="pt-2 max-w-md mx-auto">
              <div className="p-3.5 rounded bg-[#121318] border border-white/[0.12] flex items-center justify-between gap-3 font-mono text-xs sm:text-sm text-zinc-200 shadow-xl">
                <div className="flex items-center gap-2.5 overflow-x-auto">
                  <span className="text-blue-400 font-bold">$</span>
                  <span>npx openboard-app start</span>
                </div>
                <CopyButton text="npx openboard-app start" label="Copy" />
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
              <Button
                href={siteConfig.githubUrl}
                external
                variant="brand"
                size="md"
                icon={<GithubIcon className="w-4 h-4" />}
                iconRight={<Star className="w-3.5 h-3.5 fill-white text-white" />}
              >
                Star on GitHub
              </Button>

              <Button
                href="/docs"
                variant="secondary"
                size="md"
                iconRight={<ArrowRight className="w-4 h-4 text-zinc-400" />}
              >
                Explore Documentation
              </Button>
            </div>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
