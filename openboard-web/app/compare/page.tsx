import React from 'react';
import Link from 'next/link';
import { comparisonsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { Sparkles, ArrowRight, ShieldCheck, Database, Cpu, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = constructMetadata({
  title: 'Compare OpenBoard vs Alternatives (Excalidraw, Miro, tldraw)',
  description:
    'Comprehensive comparison between OpenBoard and alternative whiteboard solutions including Excalidraw, Miro, and tldraw for local-first developer workflows and AI coding agents.',
  path: '/compare',
  keywords: ['opensource board', 'secure local white board', 'excalidraw alternative', 'miro open source alternative', 'tldraw mcp', 'openboard compare'],
});

export default function CompareHubPage() {
  return (
    <div className="py-16 sm:py-24">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Competitive Analysis &amp; Feature Breakdown</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Compare OpenBoard with Alternatives
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            See how OpenBoard compares against proprietary cloud SaaS platforms and browser-only sketchpads for engineering diagrams and AI agent automation.
          </p>
        </div>

        {/* 3 Main Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparisonsData.map((item) => (
            <div
              key={item.slug}
              className="p-6 rounded-2xl bg-[#121318] border border-white/10 hover:border-blue-500/40 hover:bg-[#161720] transition-all flex flex-col justify-between space-y-6 group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                    vs {item.competitor}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">
                    {item.features.length} criteria
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                {/* Key Strengths list */}
                <div className="pt-2 space-y-1.5 border-t border-white/5 text-xs text-gray-300">
                  <div className="text-[11px] font-mono uppercase text-gray-500">Key Advantages:</div>
                  {item.pros.slice(0, 2).map((pro, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="line-clamp-1">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Button
                  href={`/compare/${item.slug}`}
                  variant="secondary"
                  size="sm"
                  className="w-full justify-between group-hover:border-blue-500/50"
                  icon={<ArrowRight className="w-3.5 h-3.5 order-last group-hover:translate-x-0.5 transition-transform" />}
                >
                  Read Full Comparison
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Capability Matrix */}
        <div className="rounded-2xl border border-white/10 bg-[#101116] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              High-Level Capability Overview
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Direct comparison of fundamental architecture, AI agent support, and privacy boundaries.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm divide-y divide-white/10">
              <thead className="bg-[#14151c] text-gray-200">
                <tr>
                  <th className="p-3.5 font-semibold">Capability</th>
                  <th className="p-3.5 font-bold text-blue-400 bg-blue-950/20 border-x border-blue-500/20">✦ OpenBoard</th>
                  <th className="p-3.5 text-gray-400">Excalidraw</th>
                  <th className="p-3.5 text-gray-400">Miro</th>
                  <th className="p-3.5 text-gray-400">tldraw SDK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr>
                  <td className="p-3.5 font-semibold text-gray-100">Storage Architecture</td>
                  <td className="p-3.5 text-blue-200 bg-blue-950/10 border-x border-blue-500/20 font-medium">Local SQLite</td>
                  <td className="p-3.5 text-gray-400">Browser LocalStorage</td>
                  <td className="p-3.5 text-gray-400">Multi-tenant Cloud</td>
                  <td className="p-3.5 text-gray-400">In-Memory / Custom</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-gray-100">Model Context Protocol (MCP)</td>
                  <td className="p-3.5 text-blue-200 bg-blue-950/10 border-x border-blue-500/20 font-medium">13 Semantic Tools (stdio + SSE)</td>
                  <td className="p-3.5 text-red-400">None</td>
                  <td className="p-3.5 text-gray-400">Proprietary REST API</td>
                  <td className="p-3.5 text-gray-400">None Built-in</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-gray-100">Telemetry &amp; Tracking</td>
                  <td className="p-3.5 text-emerald-400 bg-blue-950/10 border-x border-blue-500/20 font-medium">0% (Zero Telemetry)</td>
                  <td className="p-3.5 text-gray-400">Low</td>
                  <td className="p-3.5 text-red-400">Extensive Tracking</td>
                  <td className="p-3.5 text-gray-400">Zero</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-gray-100">Offline &amp; Air-Gapped</td>
                  <td className="p-3.5 text-emerald-400 bg-blue-950/10 border-x border-blue-500/20 font-medium">100% Offline Capable</td>
                  <td className="p-3.5 text-gray-300">Offline PWA</td>
                  <td className="p-3.5 text-red-400">Online Only</td>
                  <td className="p-3.5 text-gray-300">Depends on host app</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-gray-100">Pricing &amp; License</td>
                  <td className="p-3.5 text-blue-200 bg-blue-950/10 border-x border-blue-500/20 font-medium">Free forever (MIT)</td>
                  <td className="p-3.5 text-gray-400">Free / Cloud Tier</td>
                  <td className="p-3.5 text-gray-400">$8 - $20/user/mo</td>
                  <td className="p-3.5 text-gray-400">MIT / Business Tier</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
