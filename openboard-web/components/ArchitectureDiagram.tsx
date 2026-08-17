import React from 'react';
import { Database, Cpu, Laptop, Terminal, Radio, ShieldCheck, ArrowRight } from 'lucide-react';
import { TechnicalFrame, SectionFrame } from './ui/TechnicalFrame';
import { SectionHeader } from './ui/SectionHeader';
import { Badge } from './ui/Badge';
import { EditorialGrid } from './ui/EditorialGrid';
import { ContentCell } from './ui/ContentCell';

export function ArchitectureDiagram() {
  return (
    <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
      <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
        {/* Header Region */}
        <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08]">
          <SectionHeader
            index="03 // TOPOLOGY"
            eyebrow="Air-Gapped System Flow"
            eyebrowVariant="blue"
            title="How OpenBoard Coordinates You &amp; AI Agents Locally"
            description="No cloud servers, no webhooks, no third-party telemetry. All coordination happens over fast local IPC, SQLite, and Server-Sent Events."
            align="left"
          />
        </div>

        {/* 3-Tier Connected Topology Cells */}
        <EditorialGrid composition="4-4-4" withOuterBorder={false}>
          {/* Node 1: AI Coding Agent */}
          <ContentCell
            metadata="NODE 01 // INPUT"
            badge="stdio / IPC"
            badgeVariant="mono"
            icon={Terminal}
            title="1. AI Coding Agent"
            description="Claude Code, Cursor, or autonomous coding agents issue visual architecture requests during codebase exploration, planning, or refactoring."
            withBorderRight
            withBorderBottom={false}
            padding="lg"
            action={
              <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                <span>stdio / JSON-RPC 2.0</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            }
          />

          {/* Node 2: OpenBoard SQLite Core */}
          <ContentCell
            metadata="NODE 02 // ENGINE"
            badge="Localhost:4747"
            badgeVariant="blue"
            icon={Database}
            title="2. OpenBoard Core &amp; SQLite"
            description="Executes atomic shape mutations and vector queries against embedded SQLite (~/.openboard/openboard.db) with sub-5ms transaction speed."
            withBorderRight
            withBorderBottom={false}
            padding="lg"
            variant="raised"
            action={
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Localhost • 0 Egress</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            }
          />

          {/* Node 3: Live Browser Viewport */}
          <ContentCell
            metadata="NODE 03 // CANVAS"
            badge="tldraw Engine"
            badgeVariant="mono"
            icon={Laptop}
            title="3. Live Browser Viewport"
            description="Interactive tldraw whiteboard receives real-time mutations via Server-Sent Events (SSE). You can pan, zoom, draw, or edit collaboratively."
            withBorderRight={false}
            withBorderBottom={false}
            padding="lg"
            action={
              <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400">
                <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Real-time SSE Stream</span>
              </div>
            }
          />
        </EditorialGrid>
      </TechnicalFrame>
    </SectionFrame>
  );
}
