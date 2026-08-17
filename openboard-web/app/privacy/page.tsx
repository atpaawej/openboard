import React from 'react';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Privacy Policy — 100% Local-First & Zero Telemetry',
  description:
    'OpenBoard Privacy Policy. Learn about our 100% private, zero-telemetry, zero-cloud data collection guarantee.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 font-mono">Last updated: August 17, 2026</p>
        </header>

        <div className="p-5 rounded-xl bg-[#121318] border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>The Summary: We collect ZERO data.</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            OpenBoard is an open-source, local-first application. We do not collect, store, transmit, or monetize any of your personal data, whiteboards, diagrams, prompt histories, or usage analytics.
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Local Storage</h2>
          <p>
            All canvas data, shapes, text, connectors, board titles, and settings are stored locally on your device in an embedded SQLite database located at <code className="text-blue-300 font-mono">~/.openboard/openboard.db</code>.
          </p>

          <h2 className="text-xl font-bold text-white tracking-tight">2. No Analytics or Telemetry</h2>
          <p>
            The OpenBoard application contains zero analytics trackers, telemetry libraries, error-reporting beacons, or advertising SDKs.
          </p>

          <h2 className="text-xl font-bold text-white tracking-tight">3. Model Context Protocol (MCP) Communications</h2>
          <p>
            All communications between AI agents (Claude Code, Cursor, Codex) and OpenBoard occur locally via standard input/output (<code className="text-blue-300 font-mono">stdio</code>) or localhost HTTP/SSE streams. No data is transmitted to external servers by OpenBoard.
          </p>

          <h2 className="text-xl font-bold text-white tracking-tight">4. Open Source Verification</h2>
          <p>
            Because OpenBoard is 100% open-source under the MIT license, you can inspect the full source code on GitHub at <a href="https://github.com/atpaawej/openboard" className="text-blue-400 underline">github.com/atpaawej/openboard</a> to verify our security and privacy guarantees.
          </p>
        </div>
      </div>
    </div>
  );
}
