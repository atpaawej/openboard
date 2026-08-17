'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ArrowRight, Database, Cpu, ShieldCheck, Zap, Terminal } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { siteConfig } from '@/lib/siteConfig';
import { TechnicalFrame, SectionFrame } from './ui/TechnicalFrame';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { TerminalWindow } from './ui/TerminalWindow';
import { EditorialGrid } from './ui/EditorialGrid';
import { ContentCell } from './ui/ContentCell';
import { DashedDivider } from './ui/StructuralRule';

export function Hero() {
  const terminalTabs = [
    {
      id: 'npx',
      label: 'Instant Launch (npx)',
      command: 'npx openboard-app start',
      description: 'Launches your private whiteboard in your browser immediately. Zero account required.',
    },
    {
      id: 'mcp',
      label: 'Connect AI Agents (MCP)',
      command: 'claude mcp add openboard -- openboard mcp',
      description: 'Plugs 13 diagramming tools directly into Claude Code, Cursor, and OpenCode.',
    },
    {
      id: 'global',
      label: 'Global CLI (npm)',
      command: 'npm install -g openboard-app && openboard start',
      description: 'Installs the fast terminal CLI globally across your development environment.',
    },
  ];

  return (
    <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
      <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
        {/* Top Header Region */}
        <div className="px-6 py-12 sm:px-10 sm:py-16 border-b border-white/[0.08] space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold select-none">
              01 // WORKSPACE
            </span>
            <span className="text-zinc-600 text-xs font-mono">//</span>
            <Badge variant="blue" dot>
              Local-First • SQLite • 13 MCP Tools
            </Badge>
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              The private whiteboard where you &amp; your AI agents{' '}
              <span className="text-blue-400">build architecture together.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 max-w-3xl font-normal leading-relaxed">
              Stop paying monthly SaaS subscriptions and leaking system designs to cloud servers. OpenBoard is the 100% private infinite canvas stored in local SQLite—with a built-in MCP server that lets Claude Code and Cursor draw and inspect topology in real time.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
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
              href="/docs/quickstart"
              variant="secondary"
              size="md"
              icon={<Zap className="w-4 h-4 text-blue-400" />}
              iconRight={<ArrowRight className="w-4 h-4 text-zinc-400" />}
            >
              1-Minute Quickstart
            </Button>

            <Button
              href="/compare/openboard-vs-miro"
              variant="outline"
              size="md"
            >
              Why Leave Miro?
            </Button>
          </div>
        </div>

        {/* Asymmetric 8/4 Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 8 Cols: Terminal & Live Dashboard Viewport */}
          <div className="lg:col-span-8 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold select-none">
                TERMINAL // LAUNCH COMMAND
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                PORT: 4747
              </span>
            </div>

            <TerminalWindow
              title="terminal ~ openboard"
              tabs={terminalTabs}
              defaultTab="npx"
              dbHint="Database: ~/.openboard/openboard.db"
            />

            {/* Dashboard Visual Frame */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>CANVAS VIEWPORT // TWENTY THEME</span>
                <span className="text-zinc-500">AUTOSAVE: WAL ENABLED</span>
              </div>
              <div className="rounded-md border border-white/[0.12] bg-[#0c0d10] p-1.5 shadow-2xl relative overflow-hidden">
                <div className="rounded border border-white/[0.08] overflow-hidden bg-[#0c0d10]">
                  <Image
                    src="/dashboard.png"
                    alt="OpenBoard Workspace Dashboard — Local-First Whiteboards with Multi-Board Management and AI Agent SSE Sync"
                    width={1200}
                    height={675}
                    priority
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Connected Metric & Trust Cells */}
          <div className="lg:col-span-4 flex flex-col justify-between divide-y divide-white/[0.08] bg-[#0c0d10]">
            <ContentCell
              metadata="01 // PERSISTENCE"
              title="100% Local SQLite"
              description="Zero cloud dependencies. Your system topology stays securely in ~/.openboard/openboard.db with Write-Ahead Logging."
              icon={Database}
              withBorderRight={false}
              withBorderBottom={false}
              padding="md"
              className="flex-1"
            />

            <ContentCell
              metadata="02 // AGENT NATIVE"
              title="13 Semantic MCP Tools"
              description="High-level tools for Claude Code, Cursor, and OpenCode to create shapes, connect nodes, and inspect visual hierarchy."
              icon={Cpu}
              withBorderRight={false}
              withBorderBottom={false}
              padding="md"
              className="flex-1"
            />

            <ContentCell
              metadata="03 // SECURITY"
              title="0% Cloud Telemetry"
              description="Completely air-gapped with zero telemetry beacons, zero tokens logged, and zero recurring seat subscriptions."
              icon={ShieldCheck}
              withBorderRight={false}
              withBorderBottom={false}
              padding="md"
              className="flex-1"
            />

            <ContentCell
              metadata="04 // FREEDOM"
              title="MIT Open Source"
              description="Free forever for individuals and engineering teams without seat limits or enterprise paywalls."
              icon={Zap}
              withBorderRight={false}
              withBorderBottom={false}
              padding="md"
              className="flex-1"
            />
          </div>
        </div>
      </TechnicalFrame>
    </SectionFrame>
  );
}
