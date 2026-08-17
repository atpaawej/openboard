'use client';

import React, { useState } from 'react';
import { CopyButton } from './CopyButton';
import { Terminal, Code, Laptop, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
      guideLink: '/integrations/claude-code'
    },
    'cursor': {
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
      guideLink: '/integrations/cursor'
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
      guideLink: '/integrations/claude-desktop'
    },
    'opencode': {
      name: 'OpenCode / Codex / Hermes',
      icon: Sparkles,
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
      guideLink: '/docs/agent-setup'
    }
  };

  const current = presets[selectedAgent];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121318] p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive MCP Generator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Connect OpenBoard to Your AI Coding Agent
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Choose your AI assistant below to get the exact one-click configuration snippet.
          </p>
        </div>

        <Link
          href="/docs/agent-setup"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Full Agent Setup Guides</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Preset Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 pb-6">
        {(Object.keys(presets) as AgentPreset[]).map((key) => {
          const item = presets[key];
          const Icon = item.icon;
          const isSelected = selectedAgent === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedAgent(key)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-500/10'
                  : 'bg-[#16171e] border-white/5 hover:border-white/15 hover:bg-[#1a1c24]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <div className="font-semibold text-sm text-gray-100">{item.name}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{item.category}</div>
            </button>
          );
        })}
      </div>

      {/* Code / Command Snippets */}
      <div className="space-y-4">
        {selectedAgent === 'claude-code' && (
          <div>
            <div className="flex items-center justify-between pb-1.5 text-xs font-mono text-gray-400">
              <span>Terminal CLI Quick Command:</span>
              <CopyButton text={current.command} label="Copy Command" />
            </div>
            <div className="p-3 rounded-lg bg-[#0c0d10] border border-white/10 font-mono text-xs sm:text-sm text-blue-300 overflow-x-auto">
              $ {current.command}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between pb-1.5 text-xs font-mono text-gray-400">
            <span>JSON Configuration File Snippet:</span>
            <CopyButton text={current.configJson} label="Copy JSON" />
          </div>
          <pre className="p-4 rounded-xl bg-[#0c0d10] border border-white/10 font-mono text-xs sm:text-sm text-gray-200 overflow-x-auto">
            <code>{current.configJson}</code>
          </pre>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-gray-400">
          <p>
            ✦ Automatically unlocks <strong className="text-gray-200">13 semantic MCP tools</strong> inside {current.name}.
          </p>
          <Link
            href={current.guideLink}
            className="text-blue-400 hover:text-blue-300 font-medium underline decoration-blue-500/30 underline-offset-4"
          >
            Read {current.name} Integration Step-by-Step →
          </Link>
        </div>
      </div>
    </div>
  );
}
