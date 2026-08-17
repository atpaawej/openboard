'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Code, Laptop, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { TechnicalFrame, SectionFrame } from './ui/TechnicalFrame';
import { SectionHeader } from './ui/SectionHeader';
import { Badge } from './ui/Badge';
import { CodeSnippet } from './ui/CodeSnippet';
import { CopyButton } from './CopyButton';

type AgentPreset = 'claude-code' | 'cursor' | 'claude-desktop' | 'opencode';

export function McpConfigGenerator() {
  const [selectedAgent, setSelectedAgent] = useState<AgentPreset>('claude-code');

  const presets = {
    'claude-code': {
      name: 'Claude Code',
      icon: Terminal,
      category: 'Terminal CLI',
      desc: 'Connect Anthropic Claude Code via native CLI command or settings.json',
      command: 'claude mcp add openboard -- openboard mcp',
      configJson: `{
  "mcpServers": {
    "openboard": {
      "command": "openboard",
      "args": ["mcp"]
    }
  }
}`,
      guideLink: '/integrations/claude-code',
    },
    cursor: {
      name: 'Cursor IDE',
      icon: Code,
      category: 'IDE Composer',
      desc: 'Give Cursor AI Agent visual diagramming capabilities in your code editor',
      command: 'openboard mcp',
      configJson: `{
  "mcpServers": {
    "openboard": {
      "command": "openboard",
      "args": ["mcp"]
    }
  }
}`,
      guideLink: '/integrations/cursor',
    },
    'claude-desktop': {
      name: 'Claude Desktop',
      icon: Laptop,
      category: 'Desktop App',
      desc: 'Official Anthropic Claude Desktop app via stdio protocol',
      command: 'npx -y openboard-app mcp',
      configJson: `{
  "mcpServers": {
    "openboard": {
      "command": "npx",
      "args": ["-y", "openboard-app", "mcp"]
    }
  }
}`,
      guideLink: '/integrations/claude-desktop',
    },
    opencode: {
      name: 'OpenCode / Codex / Hermes',
      icon: Layers,
      category: 'Autonomous Agents',
      desc: 'Universal stdio / SSE JSON-RPC 2.0 interface for open-source AI agents',
      command: 'openboard mcp --log-level info',
      configJson: `{
  "mcpServers": {
    "openboard": {
      "command": "openboard",
      "args": ["mcp", "--db", "~/.openboard/openboard.db"]
    }
  }
}`,
      guideLink: '/docs/agent-setup',
    },
  };

  const current = presets[selectedAgent];

  return (
    <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
      <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
        {/* Header Region */}
        <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08]">
          <SectionHeader
            index="04 // INTEGRATION"
            eyebrow="1-Click Configuration"
            eyebrowVariant="blue"
            title="Connect OpenBoard to Your AI Assistant"
            description="Select your coding agent to get the exact configuration snippet. Unlocks 13 visual diagramming tools in seconds."
            align="left"
            action={
              <Link
                href="/docs/agent-setup"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>View All Setup Guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
        </div>

        {/* Preset Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-white/[0.08] bg-[#0c0d10]">
          {(Object.keys(presets) as AgentPreset[]).map((key, idx) => {
            const item = presets[key];
            const Icon = item.icon;
            const isSelected = selectedAgent === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedAgent(key)}
                type="button"
                className={`p-5 text-left transition-all cursor-pointer border-r last:border-r-0 border-white/[0.08] ${
                  isSelected
                    ? 'bg-[#181920] border-b-2 border-b-blue-500'
                    : 'bg-[#121318] hover:bg-[#161720]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-zinc-400'}`} />
                  {isSelected && <span className="text-xs font-mono text-blue-400 font-bold">ACTIVE</span>}
                </div>
                <div className="font-semibold text-xs sm:text-sm text-zinc-100">{item.name}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{item.category}</div>
              </button>
            );
          })}
        </div>

        {/* Configuration Details Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-[#0c0d10]">
          {selectedAgent === 'claude-code' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                <span>Terminal Quick Command:</span>
                <CopyButton text={current.command} label="Copy Command" />
              </div>
              <div className="p-3.5 rounded bg-[#121318] border border-white/[0.08] font-mono text-xs sm:text-sm text-blue-300 overflow-x-auto">
                $ {current.command}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
              <span>JSON Configuration File:</span>
            </div>
            <CodeSnippet code={current.configJson} language="json" filename="mcp-config.json" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-zinc-400 px-1 border-t border-white/[0.06]">
            <span>
              ✦ Enables Claude Code, Cursor, and OpenCode to create, modify, and query architecture diagrams.
            </span>
            <Link
              href={current.guideLink}
              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              <span>Read {current.name} Setup Guide</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </TechnicalFrame>
    </SectionFrame>
  );
}
