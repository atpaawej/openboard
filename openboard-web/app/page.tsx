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
import { Star, Terminal, ArrowRight, ShieldCheck, Database, Cpu, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { CopyButton } from '@/components/CopyButton';

export default function HomePage() {
  const excalidrawCompare = comparisonsData.find((c) => c.slug === 'openboard-vs-excalidraw');

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Feature Grid (Why Local-First & 100% Private) */}
      <FeatureGrid />

      {/* 3. System Architecture Flow */}
      <section className="py-20 border-b border-white/5 bg-[#0c0d10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ArchitectureDiagram />
        </div>
      </section>

      {/* 4. Interactive MCP Configuration Generator */}
      <section className="py-20 border-b border-white/5 bg-[#090a0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <McpConfigGenerator />
        </div>
      </section>

      {/* 5. 13 Semantic MCP Tools Matrix */}
      <section className="py-20 border-b border-white/5 bg-[#0c0d10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <McpToolMatrix />
        </div>
      </section>

      {/* 6. Comparison Section with Excalidraw & Miro */}
      <section className="py-20 border-b border-white/5 bg-[#090a0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Uncompromising Comparison</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              OpenBoard vs Legacy Whiteboards
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              See why engineers and AI practitioners switch from cloud SaaS to local-first SQLite whiteboarding.
            </p>
          </div>

          {excalidrawCompare && (
            <ComparisonTable
              competitorName="Excalidraw"
              features={excalidrawCompare.features}
              compareSlug="openboard-vs-excalidraw"
            />
          )}

          {/* Quick links to other comparisons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link
              href="/compare/openboard-vs-miro"
              className="p-4 rounded-xl bg-[#121318] border border-white/5 hover:border-blue-500/30 hover:bg-[#161720] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-sm text-gray-200 group-hover:text-white">
                  OpenBoard vs Miro
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  100% Private, Zero Cloud Subscriptions &amp; Zero Telemetry
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/compare/openboard-vs-tldraw"
              className="p-4 rounded-xl bg-[#121318] border border-white/5 hover:border-blue-500/30 hover:bg-[#161720] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-sm text-gray-200 group-hover:text-white">
                  OpenBoard vs tldraw
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Full Workspace &amp; 13-Tool MCP Server vs Raw Canvas SDK
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SEO Knowledge / Editorial Highlights */}
      <section className="py-20 border-b border-white/5 bg-[#0c0d10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Engineering Knowledge Base
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Latest Articles on Local-First &amp; AI Whiteboarding
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>View all articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/blog/why-local-first-whiteboards-matter"
              className="p-6 rounded-2xl bg-[#121318] border border-white/5 hover:border-blue-500/30 hover:bg-[#161720] transition-all space-y-3 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Security &amp; SQLite
                </span>
                <h3 className="font-bold text-base text-gray-100 group-hover:text-white transition-colors">
                  Why Local-First Whiteboards are the Future of Secure Engineering
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  Discover why top engineering teams are ditching cloud subscriptions for 100% private, local SQLite-backed infinite canvases.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 text-xs text-gray-500 flex items-center justify-between">
                <span>5 min read</span>
                <span className="text-blue-400 font-medium">Read article →</span>
              </div>
            </Link>

            <Link
              href="/blog/open-source-whiteboard-guide"
              className="p-6 rounded-2xl bg-[#121318] border border-white/5 hover:border-blue-500/30 hover:bg-[#161720] transition-all space-y-3 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Open Source
                </span>
                <h3 className="font-bold text-base text-gray-100 group-hover:text-white transition-colors">
                  Open Source Board: The Developer&apos;s Guide to 100% Private Collaboration
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  Everything you need to know about choosing, deploying, and building with open-source whiteboard workspaces without SaaS lock-in.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 text-xs text-gray-500 flex items-center justify-between">
                <span>6 min read</span>
                <span className="text-blue-400 font-medium">Read article →</span>
              </div>
            </Link>

            <Link
              href="/blog/supercharge-ai-coding-agents-with-mcp"
              className="p-6 rounded-2xl bg-[#121318] border border-white/5 hover:border-blue-500/30 hover:bg-[#161720] transition-all space-y-3 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  MCP &amp; AI Agents
                </span>
                <h3 className="font-bold text-base text-gray-100 group-hover:text-white transition-colors">
                  Supercharging AI Coding Agents with Model Context Protocol (MCP)
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  Learn how to give Claude Code, Cursor, and Codex the superpower of visual architecture diagramming through 13 semantic tools.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 text-xs text-gray-500 flex items-center justify-between">
                <span>7 min read</span>
                <span className="text-blue-400 font-medium">Read article →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Search-Optimized FAQ Section */}
      <FaqSection faqs={homeFaqs} />

      {/* 9. High-Converting Bottom CTA Banner */}
      <section className="py-24 border-b border-white/5 bg-gradient-to-b from-[#090a0d] to-[#0e1017] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#2563eb12,transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 mx-auto flex items-center justify-center text-blue-400 text-2xl font-bold shadow-lg shadow-blue-600/20">
            ✦
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Start Diagramming in Seconds
          </h2>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            100% Free, Open Source under MIT License, and stored locally on your machine.
          </p>

          <div className="pt-2 max-w-md mx-auto">
            <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-white/10 flex items-center justify-between gap-3 font-mono text-xs sm:text-sm text-gray-200">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-emerald-400 font-bold">$</span>
                <span>npx openboard-app start</span>
              </div>
              <CopyButton text="npx openboard-app start" label="Copy" />
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98]"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Star atpaawej/openboard on GitHub</span>
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            </a>

            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#14151c] hover:bg-[#1a1c24] text-gray-200 hover:text-white font-semibold text-xs sm:text-sm border border-white/10 hover:border-blue-500/40 transition-all active:scale-[0.98]"
            >
              <span>Explore Documentation</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
