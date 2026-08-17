import React from 'react';
import { Lock, Cpu, Zap, Eye, Radio, Keyboard, CheckCircle2 } from 'lucide-react';
import { TechnicalFrame, SectionFrame } from './ui/TechnicalFrame';
import { SectionHeader } from './ui/SectionHeader';
import { EditorialGrid } from './ui/EditorialGrid';
import { ContentCell } from './ui/ContentCell';
import { Badge } from './ui/Badge';

export function FeatureGrid() {
  const narrativePillars = [
    {
      index: '01 // SOVEREIGNTY',
      problem: 'Cloud Whiteboards Leak Proprietary Architecture',
      problemDesc:
        'SaaS tools require logins, charge per-seat subscriptions, and upload your confidential database schemas and microservice topology to third-party clouds.',
      solution: '100% Private Local SQLite',
      solutionDesc:
        'All boards, nodes, and metadata live in ~/.openboard/openboard.db. Zero accounts, zero cloud telemetry, fully air-gapped.',
      icon: Lock,
      badge: 'Local-First',
      badgeVariant: 'blue' as const,
    },
    {
      index: '02 // AGENTS',
      problem: 'AI Coding Assistants Cannot See or Draw Architecture',
      problemDesc:
        'Claude Code and Cursor generate thousands of lines of code, but remain blind to visual system topology and cannot sketch or review design documents.',
      solution: '13 Semantic MCP Tools',
      solutionDesc:
        'Built-in Model Context Protocol server unlocks tools to create nodes, draw labeled arrows, group services, and query visual relationships.',
      icon: Cpu,
      badge: 'MCP Native',
      badgeVariant: 'blue' as const,
    },
    {
      index: '03 // SIMPLICITY',
      problem: 'Canvas SDKs Require Massive Boilerplate',
      problemDesc:
        'Raw drawing SDKs leave you to build persistence, state sync, board managers, trash lifecycles, and export engines entirely from scratch.',
      solution: 'Instant Zero-Config Workspace',
      solutionDesc:
        'Run `npx openboard-app start` to instantly get a full-featured multi-board workspace, dark UI, debounced auto-save, and live SSE updates.',
      icon: Zap,
      badge: 'Zero Setup',
      badgeVariant: 'blue' as const,
    },
  ];

  const technicalCapabilities = [
    {
      index: 'CAPABILITY // 01',
      icon: Eye,
      title: 'Sub-5ms Headless Canvas Inspection',
      description:
        'AI agents can inspect canvas element hierarchies and export crisp vector SVG snapshots in milliseconds without requiring heavy headless browsers.',
    },
    {
      index: 'CAPABILITY // 02',
      icon: Radio,
      title: 'Live Terminal-to-Browser Projection (SSE)',
      description:
        'When your terminal AI agent modifies a whiteboard, mutations stream directly into your browser viewport in real time over Server-Sent Events.',
    },
    {
      index: 'CAPABILITY // 03',
      icon: Keyboard,
      title: 'Keyboard-First Flow for Night Owls',
      description:
        'Press N for new board, / to search, Space+Drag to pan, and Cmd+D to duplicate. Built to keep your hands on the keyboard.',
    },
  ];

  return (
    <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
      <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
        {/* Header Region */}
        <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08]">
          <SectionHeader
            index="02 // ARCHITECTURE"
            eyebrow="Developer-Grade System"
            eyebrowVariant="blue"
            title="Built for the Problems Engineers Actually Care About"
            description="We eliminated mandatory cloud logins, expensive seat subscriptions, and text-only AI limitations to give you a private, agent-collaborative canvas."
            align="left"
          />
        </div>

        {/* 3 Core Problem vs Solution Connected Cells */}
        <EditorialGrid composition="4-4-4" withOuterBorder={false}>
          {narrativePillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ContentCell
                key={idx}
                metadata={item.index}
                badge={item.badge}
                badgeVariant={item.badgeVariant}
                icon={Icon}
                withBorderRight={idx !== 2}
                withBorderBottom
                padding="lg"
                className="space-y-4"
              >
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    The Old Friction
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-300">
                    {item.problem}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.problemDesc}
                  </p>
                </div>

                <div className="p-3.5 rounded bg-[#181920] border border-white/[0.08] space-y-1.5 mt-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{item.solution}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.solutionDesc}
                  </p>
                </div>
              </ContentCell>
            );
          })}
        </EditorialGrid>

        {/* 3 Lower Technical Capabilities Connected Matrix */}
        <EditorialGrid composition="4-4-4" withOuterBorder={false}>
          {technicalCapabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ContentCell
                key={idx}
                metadata={item.index}
                icon={Icon}
                title={item.title}
                description={item.description}
                withBorderRight={idx !== 2}
                withBorderBottom={false}
                padding="md"
                variant="subtle"
              />
            );
          })}
        </EditorialGrid>
      </TechnicalFrame>
    </SectionFrame>
  );
}
