import React from 'react';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { Lock, CheckCircle2 } from 'lucide-react';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata = constructMetadata({
  title: 'Privacy Policy — 100% Local-First & Zero Telemetry',
  description:
    'OpenBoard Privacy Policy. Learn about our 100% private, zero-telemetry, zero-cloud data collection guarantee.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
        ]}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="md" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="p-6 sm:p-10 border-b border-white/[0.08]">
            <SectionHeader
              index="LEGAL // PRIVACY"
              eyebrow="Zero Telemetry Guarantee"
              eyebrowVariant="success"
              title="Privacy Policy"
              description="Last updated: August 17, 2026"
              align="left"
            />
          </div>

          <div className="p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#0c0d10]">
            <div className="p-5 rounded bg-[#121318] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>The Summary: We collect ZERO data.</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                OpenBoard is an open-source, local-first application. We do not collect, store, transmit, or monetize any of your personal data, whiteboards, diagrams, prompt histories, or usage analytics.
              </p>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-tight pt-2">1. Local Storage</h2>
            <p>
              All canvas data, shapes, text, connectors, board titles, and settings are stored locally on your device in an embedded SQLite database located at <code className="text-blue-300 font-mono">~/.openboard/openboard.db</code>.
            </p>

            <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-tight pt-2">2. No Analytics or Telemetry</h2>
            <p>
              The OpenBoard application contains zero analytics trackers, telemetry libraries, error-reporting beacons, or advertising SDKs.
            </p>

            <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-tight pt-2">3. Model Context Protocol (MCP) Communications</h2>
            <p>
              All communications between AI agents (Claude Code, Cursor, Codex) and OpenBoard occur locally via standard input/output (<code className="text-blue-300 font-mono">stdio</code>) or localhost HTTP/SSE streams. No data is transmitted to external servers by OpenBoard.
            </p>

            <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-tight pt-2">4. Open Source Verification</h2>
            <p>
              Because OpenBoard is 100% open-source under the MIT license, you can inspect the full source code on GitHub at <a href="https://github.com/atpaawej/openboard" className="text-blue-400 underline">github.com/atpaawej/openboard</a> to verify our security and privacy guarantees.
            </p>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
