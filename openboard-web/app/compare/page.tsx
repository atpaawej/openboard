import React from 'react';
import Link from 'next/link';
import { comparisonsData } from '@/lib/content';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { ArrowRight } from 'lucide-react';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialGrid } from '@/components/ui/EditorialGrid';
import { ContentCell } from '@/components/ui/ContentCell';
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
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
        ]}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="px-6 py-12 sm:px-10 border-b border-white/[0.08]">
            <SectionHeader
              index="COMPARE // ALTERNATIVES"
              eyebrow="Objective Analysis"
              eyebrowVariant="blue"
              title="Compare OpenBoard with Alternatives"
              description="See how OpenBoard compares against proprietary cloud SaaS platforms and browser-only sketchpads for engineering diagrams and AI agent automation."
              align="left"
            />
          </div>

          {/* 3 Main Comparison Connected Cells */}
          <EditorialGrid composition="4-4-4" withOuterBorder={false}>
            {comparisonsData.map((item, idx) => (
              <ContentCell
                key={item.slug}
                metadata={`vs ${item.competitor.toUpperCase()}`}
                badge={`${item.features.length} criteria`}
                badgeVariant="mono"
                title={item.title}
                description={item.summary}
                withBorderRight={idx !== 2}
                withBorderBottom
                padding="lg"
                action={
                  <div className="space-y-3">
                    <div className="space-y-1 text-xs text-zinc-300">
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Key Advantages:</div>
                      {item.pros.slice(0, 2).map((pro, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span className="line-clamp-1 text-zinc-300">{pro}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      href={`/compare/${item.slug}`}
                      variant="secondary"
                      size="sm"
                      className="w-full justify-between"
                      iconRight={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Read Full Comparison
                    </Button>
                  </div>
                }
              />
            ))}
          </EditorialGrid>

          {/* High-Level Capability Matrix */}
          <div className="p-6 sm:p-10 space-y-4 bg-[#0c0d10]">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight uppercase">
                High-Level Capability Matrix
              </h2>
              <p className="text-xs text-zinc-400">
                Direct comparison across security, local SQLite persistence, AI agent integration, and licensing.
              </p>
            </div>

            <div className="border border-white/[0.08] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#121318] text-xs text-zinc-400 uppercase font-mono">
                    <th className="p-3.5">Capability</th>
                    <th className="p-3.5 text-blue-400 bg-blue-600/5">OpenBoard</th>
                    <th className="p-3.5">Excalidraw</th>
                    <th className="p-3.5">Miro</th>
                    <th className="p-3.5">tldraw SDK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-zinc-300 bg-[#0c0d10]">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-semibold text-white">Local SQLite Persistence</td>
                    <td className="p-3.5 text-emerald-400 font-bold bg-blue-600/[0.02]">✓ Yes (~/.openboard)</td>
                    <td className="p-3.5 text-zinc-500">Browser Cache</td>
                    <td className="p-3.5 text-zinc-500">Cloud Only</td>
                    <td className="p-3.5 text-zinc-500">DIY Custom</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-semibold text-white">AI Agent (MCP) Native</td>
                    <td className="p-3.5 text-emerald-400 font-bold bg-blue-600/[0.02]">✓ 13 Semantic Tools</td>
                    <td className="p-3.5 text-zinc-500">None</td>
                    <td className="p-3.5 text-zinc-500">REST API (Paid)</td>
                    <td className="p-3.5 text-zinc-500">Raw Canvas SDK</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-semibold text-white">Zero Cloud Telemetry</td>
                    <td className="p-3.5 text-emerald-400 font-bold bg-blue-600/[0.02]">✓ 100% Air-Gapped</td>
                    <td className="p-3.5 text-zinc-400">Opt-out required</td>
                    <td className="p-3.5 text-red-400">Mandatory Cloud</td>
                    <td className="p-3.5 text-zinc-400">Depends on host</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-semibold text-white">Cost &amp; Licensing</td>
                    <td className="p-3.5 text-emerald-400 font-bold bg-blue-600/[0.02]">✓ Free / MIT</td>
                    <td className="p-3.5 text-zinc-300">Free / Paid SaaS</td>
                    <td className="p-3.5 text-red-400">$8 - $16 / seat / mo</td>
                    <td className="p-3.5 text-zinc-300">Commercial SDK license</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-semibold text-white">Live SSE Browser Projection</td>
                    <td className="p-3.5 text-emerald-400 font-bold bg-blue-600/[0.02]">✓ Built-in SSE</td>
                    <td className="p-3.5 text-zinc-500">None</td>
                    <td className="p-3.5 text-zinc-500">Websockets (Cloud)</td>
                    <td className="p-3.5 text-zinc-500">DIY sync server</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
