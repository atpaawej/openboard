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
  Sparkles,
  Terminal,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FolderSync,
  Layers,
  Code2
} from 'lucide-react';
import { CopyButton } from '@/components/CopyButton';
import { Button } from '@/components/ui/Button';
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
          badge: 'Local-First'
        },
        {
          icon: ShieldCheck,
          title: 'Zero Cloud Telemetry',
          detail: 'No tracking cookies, no telemetry beacons, no analytics pings, and no mandatory cloud accounts. Complete privacy for proprietary enterprise architecture.',
          badge: 'Air-Gapped'
        },
        {
          icon: FolderSync,
          title: 'Full Board Lifecycle & Trash',
          detail: 'Multi-board dashboard, favorites, instant duplication, debounced autosave, soft delete (Trash), and permanent purging directly in your local database.',
          badge: 'Relational'
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
          badge: 'stdio + SSE'
        },
        {
          icon: Terminal,
          title: 'Claude Code & Terminal Agents',
          detail: 'Prompt Claude in your terminal to diagram microservices, auth flows, and database schemas with instant live streaming to your browser.',
          badge: 'CLI Native'
        },
        {
          icon: Code2,
          title: 'Cursor IDE & OpenCode Integration',
          detail: 'Allow Cursor Composer and open-source coding agents to read your architecture and validate database schemas while you write code.',
          badge: 'IDE Support'
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
          badge: 'Sub-5ms Engine'
        },
        {
          icon: Radio,
          title: 'Real-Time SSE Live Projection',
          detail: 'When viewing http://localhost:4747, agent mutations stream smoothly into your open browser tab in real time with zero perceptible lag.',
          badge: 'Live Sync'
        },
        {
          icon: Palette,
          title: 'Twenty-Inspired Dark Workspace',
          detail: 'Aesthetic near-black surfaces (#0c0d10), electric blue accents (#2563eb), crisp vector shapes, and zero-dependency SVG iconography built for night owls.',
          badge: 'Dark Theme'
        },
        {
          icon: Keyboard,
          title: 'Keyboard-First Productivity',
          detail: 'Press N for new whiteboards, / to focus search, Esc to deselect, Space+Drag to pan, and Cmd+D to duplicate shapes instantly.',
          badge: 'Shortcuts'
        }
      ]
    }
  ];

  return (
    <div className="py-16 sm:py-24 space-y-20">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
        ]}
      />

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Capability Overview</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Features Built for Developers &amp; AI Agents
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Every feature in OpenBoard is engineered to eliminate cloud subscription friction, protect your technical privacy, and empower autonomous AI coding assistants.
          </p>
        </div>
      </div>

      {/* Feature Groups Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {featureGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-6">
            <div className="pb-3 border-b border-white/5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {group.category}
              </h2>
              <span className="text-xs font-mono text-blue-400">
                ✦ {group.tagline}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#121318] border border-white/10 hover:border-blue-500/40 hover:bg-[#161720] transition-all space-y-4 group shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:border-blue-500/50 group-hover:bg-blue-500/20 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-100 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Interactive Terminal Callout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#141520] to-[#0c0d12] border border-white/10 shadow-2xl space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 mx-auto flex items-center justify-center text-blue-400 text-2xl font-bold">
            ✦
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Try All Features Instantly with npx
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              No account creation, no cloud setup, and zero credit card required.
            </p>
          </div>

          <div className="max-w-md mx-auto p-3.5 rounded-xl bg-[#0c0d10] border border-white/10 flex items-center justify-between font-mono text-xs sm:text-sm text-gray-200">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-emerald-400 font-bold">$</span>
              <span>npx openboard-app start</span>
            </div>
            <CopyButton text="npx openboard-app start" label="Copy" />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button
              href="/docs/quickstart"
              variant="primary"
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
              variant="secondary"
              size="md"
            >
              Compare Alternatives
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
