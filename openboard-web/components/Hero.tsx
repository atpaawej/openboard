'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Star, ArrowRight, ShieldCheck, Database, Cpu, Sparkles, Check, Zap } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { CopyButton } from './CopyButton';
import { siteConfig } from '@/lib/siteConfig';

export function Hero() {
  const [activeTab, setActiveTab] = useState<'npx' | 'global' | 'mcp'>('npx');

  const commands = {
    npx: 'npx openboard-app start',
    global: 'npm install -g openboard-app && openboard start',
    mcp: 'openboard mcp'
  };

  const commandLabels = {
    npx: 'Launch instantly (No install)',
    global: 'Install globally via npm',
    mcp: 'AI Agent MCP Server'
  };

  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-white/5">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[200px] bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top trust pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14151b] border border-blue-500/30 text-xs font-medium text-blue-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Open Source • Local-First • 13 MCP Semantic Tools</span>
          </div>

          {/* Main H1 Title targeting keywords */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            The <span className="text-blue-400 underline decoration-blue-500/40 underline-offset-8">Secure Local Whiteboard</span> for Developers &amp; AI Agents
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed">
            OpenBoard is the 100% private, local-first infinite canvas pairing an interactive <strong className="text-white font-medium">tldraw</strong> workspace with a high-performance <strong className="text-white font-medium">Model Context Protocol (MCP)</strong> server for Claude Code, Cursor, and autonomous AI agents. Stored locally in SQLite.
          </p>

          {/* Terminal Command Widget */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="rounded-xl border border-white/10 bg-[#101116] shadow-2xl shadow-black/80 overflow-hidden text-left">
              {/* Terminal Tabs */}
              <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-white/5 bg-[#0d0e12]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span className="text-[11px] font-mono text-gray-400 ml-2">openboard-terminal</span>
                </div>
                <div className="flex items-center gap-1">
                  {(['npx', 'global', 'mcp'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                        activeTab === tab
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Command row */}
              <div className="p-4 flex items-center justify-between gap-4 font-mono text-sm bg-[#101116]">
                <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
                  <span className="text-emerald-400 font-bold select-none">$</span>
                  <span className="text-gray-100 whitespace-nowrap">{commands[activeTab]}</span>
                </div>
                <CopyButton text={commands[activeTab]} label="Copy" />
              </div>

              {/* Helper text */}
              <div className="px-4 pb-2.5 pt-0 text-[11px] text-gray-500 font-sans flex items-center justify-between">
                <span>{commandLabels[activeTab]}</span>
                <span className="text-gray-500">Database: ~/.openboard/openboard.db</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98]"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Star on GitHub</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-900/60 border border-blue-400/30 text-xs font-mono">
                <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                <span>atpaawej</span>
              </span>
            </a>

            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#16171e] hover:bg-[#1e2029] text-gray-200 hover:text-white font-medium text-xs sm:text-sm border border-white/10 hover:border-blue-500/40 transition-all active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span>See Features</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>

          {/* Trust Guarantees Grid */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3 rounded-lg bg-[#111217] border border-white/5 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-200">100% Local SQLite</div>
                <div className="text-[11px] text-gray-400">Zero cloud dependencies</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#111217] border border-white/5 flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-200">13 Semantic Tools</div>
                <div className="text-[11px] text-gray-400">Claude Code &amp; Cursor</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#111217] border border-white/5 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-200">Zero Telemetry</div>
                <div className="text-[11px] text-gray-400">100% private &amp; air-gapped</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#111217] border border-white/5 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-200">MIT Open Source</div>
                <div className="text-[11px] text-gray-400">Free forever without limits</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Visual Showcase */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-white/10 to-white/0 border border-white/10 shadow-2xl shadow-blue-900/10">
            <div className="rounded-xl overflow-hidden bg-[#0c0d10] border border-white/10 relative">
              <Image
                src="/dashboard.png"
                alt="OpenBoard Workspace Dashboard — Twenty-Inspired Dark Theme with Whiteboards, Trash, and Canvas"
                width={1200}
                height={675}
                priority
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none rounded-xl" />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500 font-mono">
            OpenBoard Workspace Dashboard: Multi-board management, favorites, debounced SQLite autosave, and keyboard-first navigation.
          </p>
        </div>
      </div>
    </section>
  );
}
