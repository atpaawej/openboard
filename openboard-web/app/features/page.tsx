import React from 'react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import {
  Lock,
  Cpu,
  Palette,
  Eye,
  Radio,
  Keyboard,
  Database,
  Terminal,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FolderSync,
  Layers,
  Code2
} from 'lucide-react';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialGrid } from '@/components/ui/EditorialGrid';
import { ContentCell } from '@/components/ui/ContentCell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { siteConfig } from '@/lib/siteConfig';

export const metadata = constructMetadata({
  title: 'Features — Local SQLite, 13 MCP Tools & Infinite Canvas',
  description:
    'Explore all features of OpenBoard: 100% private SQLite local persistence, 13 Semantic Model Context Protocol tools for AI agents, live SSE sync, headless SVG vector exports, and a Twenty-inspired dark workspace.',
  path: '/features',
  keywords: [
    'openboard features',
    'mcp whiteboard features',
    'local first whiteboard sqlite',
    'claude code whiteboard tools',
    'cursor mcp canvas'
  ],
});

export default function FeaturesPage() {
  const featureGroups = [
    {
      category: 'Data Sovereignty & Local Storage',
      tagline: '100% Private, Air-Gapped & Offline',
      items: [
        {
          icon: Database,
          title: 'Embedded SQLite Database',
          detail: 'All whiteboards, shapes, connectors, and versions reside in ~/.openboard/openboard.db with Write-Ahead Logging (WAL) for sub-millisecond atomic transactions.',
          badge: 'Local-First',
          badgeVariant: 'blue' as const
        },
        {
          icon: ShieldCheck,
          title: 'Zero Cloud Telemetry',
          detail: 'No tracking cookies, no telemetry beacons, no analytics pings, and no mandatory cloud accounts. Complete privacy for proprietary enterprise architecture.',
          badge: 'Air-Gapped',
          badgeVariant: 'success' as const
        },
        {
          icon: FolderSync,
          title: 'Full Board Lifecycle & Trash',
          detail: 'Multi-board dashboard, favorites, instant duplication, debounced autosave, soft delete (Trash), and permanent purging directly in your local database.',
          badge: 'Relational',
          badgeVariant: 'mono' as const
        }
      ]
    },
    {
      category: 'AI Agent & Model Context Protocol',
      tagline: 'Semantic Diagramming for Autonomous Coding Assistants',
      items: [
        {
          icon: Cpu,
          title: '13 Semantic MCP Tools',
          detail: 'High-level JSON-RPC 2.0 tools for creating boards, batch mutating shapes, drawing directional connectors, grouping frames, and inspecting canvas state.',
          badge: 'stdio + SSE',
          badgeVariant: 'blue' as const
        },
        {
          icon: Terminal,
          title: 'Claude Code & Terminal Agents',
          detail: 'Prompt Claude in your terminal to diagram microservices, auth flows, and database schemas with instant live streaming to your browser.',
          badge: 'CLI Native',
          badgeVariant: 'blue' as const
        },
        {
          icon: Code2,
          title: 'Cursor IDE & OpenCode Integration',
          detail: 'Allow Cursor Composer and open-source coding agents to read your architecture and validate database schemas while you write code.',
          badge: 'IDE Support',
          badgeVariant: 'blue' as const
        }
      ]
    },
    {
      category: 'Visual Engine & Developer Experience',
      tagline: 'Infinite Vector Canvas with Zero Bloat',
      items: [
        {
          icon: Eye,
          title: 'Headless Canvas & Sub-5ms SVG Export',
          detail: 'Inspect visual element hierarchies and render standalone pixel-perfect vector SVG snapshots directly from CLI scripts without headless browsers.',
          badge: 'Sub-5ms Engine',
          badgeVariant: 'blue' as const
        },
        {
          icon: Radio,
          title: 'Real-Time SSE Live Projection',
          detail: 'When viewing http://localhost:4747, agent mutations stream smoothly into your open browser tab in real time with zero perceptible lag.',
          badge: 'Live Sync',
          badgeVariant: 'blue' as const
        },
        {
          icon: Keyboard,
          title: 'Keyboard-First Flow',
          detail: 'Press N for new whiteboards, / to focus search, Esc to deselect, Space+Drag to pan, and Cmd+D to duplicate shapes instantly.',
          badge: 'Shortcuts',
          badgeVariant: 'mono' as const
        }
      ]
    }
  ];

  return (
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
        ]}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="px-6 py-12 sm:px-10 border-b border-white/[0.08]">
            <SectionHeader
              index="FEATURES // OVERVIEW"
              eyebrow="Complete System Capabilities"
              eyebrowVariant="blue"
              title="Engineered for Privacy, Speed, &amp; AI Autonomy"
              description="Every layer of OpenBoard is crafted to eliminate cloud subscription friction, protect your technical privacy, and empower autonomous AI coding assistants."
              align="left"
            />
          </div>

          {/* Feature Groups */}
          {featureGroups.map((group, gIdx) => (
            <div key={gIdx} className="border-b border-white/[0.08] last:border-b-0">
              <div className="px-6 py-4 sm:px-10 bg-[#121318] border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  {group.category}
                </h2>
                <span className="text-xs font-mono text-blue-400">
                  {group.tagline}
                </span>
              </div>

              <EditorialGrid composition="4-4-4" withOuterBorder={false}>
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <ContentCell
                      key={idx}
                      metadata={`0${idx + 1} // ${item.badge.toUpperCase()}`}
                      badge={item.badge}
                      badgeVariant={item.badgeVariant}
                      icon={Icon}
                      title={item.title}
                      description={item.detail}
                      withBorderRight={idx !== 2}
                      withBorderBottom={false}
                      padding="lg"
                    />
                  );
                })}
              </EditorialGrid>
            </div>
          ))}

          {/* Bottom Launch Callout */}
          <div className="p-8 sm:p-12 text-center space-y-5 bg-[#0c0d10]">
            <div className="space-y-2 max-w-xl mx-auto">
              <Badge variant="blue" size="md">Instant Local Launch</Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Try All Features Instantly with npx
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                No account creation, no cloud setup, and zero credit card required.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <TerminalWindow
                title="terminal ~ start"
                tabs={[
                  {
                    id: 'npx',
                    label: 'npx',
                    command: 'npx openboard-app start',
                    description: 'Zero install, launches in browser instantly'
                  }
                ]}
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                href="/docs/quickstart"
                variant="brand"
                size="md"
              >
                Get Started with Quickstart
              </Button>
              <Button
                href="/docs"
                variant="secondary"
                size="md"
              >
                Explore Documentation
              </Button>
              <Button
                href="/compare"
                variant="outline"
                size="md"
              >
                Compare Alternatives
              </Button>
            </div>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
