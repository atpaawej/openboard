import React from 'react';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { ShieldCheck, Lock, Database, Terminal, Server, KeyRound, Cpu, CheckCircle } from 'lucide-react';
import { CopyButton } from '@/components/CopyButton';

export const metadata = constructMetadata({
  title: 'Security Architecture & Local-First Guarantees',
  description:
    'Deep dive into OpenBoard\'s security model: 100% private SQLite local persistence, zero cloud telemetry, air-gapped safety, and secure stdio MCP integration for AI agents.',
  path: '/security',
  keywords: ['secure local white board', 'local-first security', 'sqlite security', 'mcp security model', 'air-gapped whiteboard'],
});

export default function SecurityPage() {
  return (
    <div className="py-16 sm:py-24">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Security', url: '/security' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Whitepaper</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Security Architecture &amp; Local-First Guarantees
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            OpenBoard is engineered from the ground up for strict data sovereignty, confidentiality, and air-gapped enterprise environments.
          </p>
        </header>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#121318] border border-white/5 space-y-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Local SQLite Storage</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All whiteboards, shapes, connectors, and versions reside solely in <code className="text-blue-300">~/.openboard/openboard.db</code> on your local disk.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121318] border border-white/5 space-y-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Zero Cloud Telemetry</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Zero tracking cookies, zero analytics beacons, zero telemetry pings, and zero remote logging scripts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121318] border border-white/5 space-y-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">Isolated MCP Stdio Sandbox</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              AI agents interact exclusively through local standard I/O (stdio) or localhost SSE. No third-party network requests are ever triggered.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121318] border border-white/5 space-y-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Air-Gapped Operation</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              OpenBoard runs 100% offline without needing an active internet connection, perfect for confidential defense and enterprise systems.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <section className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-2xl font-bold text-white tracking-tight border-b border-white/5 pb-2">
            1. Threat Model &amp; Data Boundaries
          </h2>
          <p>
            Proprietary architectural blueprints—including microservice topologies, database schemas, and cryptographic keyflows—are prime targets for intellectual property theft. Storing these diagrams on multi-tenant SaaS platforms introduces significant vulnerability vectors.
          </p>
          <p>
            OpenBoard eliminates this attack surface by executing completely within your user account boundary. The local server binds strictly to <code className="text-blue-300 font-mono">127.0.0.1</code> by default, preventing external network interfaces from accessing the canvas or SQLite database.
          </p>

          <h2 className="text-2xl font-bold text-white tracking-tight border-b border-white/5 pb-2 pt-4">
            2. Model Context Protocol (MCP) Security Controls
          </h2>
          <p>
            When AI coding assistants like Claude Code, Cursor, or Codex connect to OpenBoard, they communicate via standard input/output (<code className="text-blue-300 font-mono">stdio</code>) pipes spawned by the parent IDE process.
          </p>
          <ul className="space-y-2 list-disc list-inside text-gray-300">
            <li><strong>Input Validation:</strong> All 13 semantic tools parse and validate JSON payloads using strict runtime schemas.</li>
            <li><strong>Atomic Transactions:</strong> Canvas mutations are wrapped in SQLite transactions with Write-Ahead Logging (WAL) to prevent data corruption.</li>
            <li><strong>No Network Egress:</strong> The MCP server process initiates zero outbound network connections.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white tracking-tight border-b border-white/5 pb-2 pt-4">
            3. Backup &amp; Disaster Recovery
          </h2>
          <p>
            Because OpenBoard uses standard SQLite, backing up your entire whiteboard library is as simple as copying a single file:
          </p>
          <div className="p-3 rounded-lg bg-[#0c0d10] border border-white/10 flex items-center justify-between font-mono text-xs text-gray-200">
            <span>cp ~/.openboard/openboard.db ~/Dropbox/Backups/openboard-backup.db</span>
            <CopyButton text="cp ~/.openboard/openboard.db ~/Dropbox/Backups/openboard-backup.db" label="Copy" />
          </div>
        </section>
      </div>
    </div>
  );
}
