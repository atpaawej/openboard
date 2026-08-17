import React from 'react';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { ShieldCheck, Lock, Database, Terminal, Server, Cpu } from 'lucide-react';
import { CopyButton } from '@/components/CopyButton';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialGrid } from '@/components/ui/EditorialGrid';
import { ContentCell } from '@/components/ui/ContentCell';

export const metadata = constructMetadata({
  title: 'Security Architecture & Local-First Guarantees',
  description:
    'Deep dive into OpenBoard\'s security model: 100% private SQLite local persistence, zero cloud telemetry, air-gapped safety, and secure stdio MCP integration for AI agents.',
  path: '/security',
  keywords: ['secure local white board', 'local-first security', 'sqlite security', 'mcp security model', 'air-gapped whiteboard'],
});

export default function SecurityPage() {
  return (
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Security', url: '/security' },
        ]}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="px-6 py-12 sm:px-10 border-b border-white/[0.08]">
            <SectionHeader
              index="SECURITY // ARCHITECTURE"
              eyebrow="Air-Gapped Trust Model"
              eyebrowVariant="success"
              title="Security Architecture &amp; Data Sovereignty"
              description="OpenBoard is engineered from the ground up for strict data confidentiality, zero cloud egress, and air-gapped enterprise environments."
              align="left"
            />
          </div>

          {/* 4 Pillars Editorial Grid */}
          <EditorialGrid composition="4-4-4" withOuterBorder={false}>
            <ContentCell
              metadata="01 // STORAGE"
              icon={Database}
              title="100% Local SQLite Storage"
              description="All whiteboards, shapes, connectors, and versions reside solely in ~/.openboard/openboard.db on your local filesystem."
              withBorderRight
              withBorderBottom
              padding="lg"
            />
            <ContentCell
              metadata="02 // TELEMETRY"
              icon={Lock}
              title="Zero Cloud Telemetry"
              description="Zero tracking cookies, zero analytics beacons, zero telemetry pings, and zero remote logging scripts."
              withBorderRight
              withBorderBottom
              padding="lg"
            />
            <ContentCell
              metadata="03 // SANDBOX"
              icon={Cpu}
              title="Isolated MCP Stdio Sandbox"
              description="AI agents interact exclusively through local standard I/O (stdio) or localhost SSE. No third-party network requests are ever triggered."
              withBorderRight={false}
              withBorderBottom
              padding="lg"
            />
          </EditorialGrid>

          {/* Detailed Security Narrative */}
          <div className="p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#0c0d10]">
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-tight border-b border-white/[0.08] pb-2">
              1. Threat Model &amp; Data Boundaries
            </h2>
            <p>
              Proprietary architectural blueprints—including microservice topologies, database schemas, and cryptographic keyflows—are prime targets for intellectual property theft. Storing these diagrams on multi-tenant SaaS platforms introduces significant vulnerability vectors.
            </p>
            <p>
              OpenBoard eliminates this attack surface by executing completely within your user account boundary. The local server binds strictly to <code className="text-blue-300 font-mono">127.0.0.1</code> by default, preventing external network interfaces from accessing the canvas or SQLite database.
            </p>

            <h2 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-tight border-b border-white/[0.08] pb-2 pt-4">
              2. Model Context Protocol (MCP) Security Controls
            </h2>
            <p>
              When AI coding assistants like Claude Code, Cursor, or Codex connect to OpenBoard, they communicate via standard input/output (<code className="text-blue-300 font-mono">stdio</code>) pipes spawned by the parent IDE process.
            </p>
            <ul className="space-y-2 list-disc list-inside text-zinc-300">
              <li><strong>Input Validation:</strong> All 13 semantic tools parse and validate JSON payloads using strict runtime schemas.</li>
              <li><strong>Atomic Transactions:</strong> Canvas mutations are wrapped in SQLite transactions with Write-Ahead Logging (WAL) to prevent data corruption.</li>
              <li><strong>No Network Egress:</strong> The MCP server process initiates zero outbound network connections.</li>
            </ul>

            <h2 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-tight border-b border-white/[0.08] pb-2 pt-4">
              3. Air-Gapped Verification Command
            </h2>
            <p>
              You can verify OpenBoard&apos;s network isolation by running the start command with complete offline sandboxing:
            </p>
            <div className="p-3.5 rounded bg-[#121318] border border-white/[0.08] font-mono text-xs text-blue-300 flex items-center justify-between">
              <span>$ openboard start --host 127.0.0.1 --offline</span>
              <CopyButton text="openboard start --host 127.0.0.1 --offline" label="Copy" />
            </div>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
