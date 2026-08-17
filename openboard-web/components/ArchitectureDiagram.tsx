import React from 'react';
import { Database, Cpu, Laptop, Terminal, Radio, Shield, Sparkles } from 'lucide-react';

export function ArchitectureDiagram() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101116] p-6 sm:p-8 shadow-xl">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local-First System Topology</span>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          How OpenBoard Coordinates Humans &amp; AI Agents
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm">
          A fully private, high-performance architecture running entirely inside your local machine.
        </p>
      </div>

      {/* Visual Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch relative">
        {/* Step 1: External AI Agents */}
        <div className="p-5 rounded-xl bg-[#14151c] border border-white/5 flex flex-col justify-between space-y-3 relative group hover:border-blue-500/30 transition-all">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">External AI Agents</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Claude Code, Cursor, OpenCode, Codex, and Hermes issue autonomous architecture and diagramming requests.
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-purple-300">
            stdio / SSE (JSON-RPC 2.0)
          </div>
        </div>

        {/* Step 2: OpenBoard MCP Server & SQLite Core */}
        <div className="p-5 rounded-xl bg-[#181a24] border border-blue-500/40 shadow-lg shadow-blue-900/10 flex flex-col justify-between space-y-3 relative">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">OpenBoard MCP &amp; SQLite</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 font-mono">
                Localhost
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              13 semantic tools execute atomic transactions against embedded SQLite (<code className="text-blue-300 text-[11px]">~/.openboard/openboard.db</code>) and headless SVG engine.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>0% Cloud • 100% Air-Gapped</span>
          </div>
        </div>

        {/* Step 3: Browser Whiteboard */}
        <div className="p-5 rounded-xl bg-[#14151c] border border-white/5 flex flex-col justify-between space-y-3 relative group hover:border-cyan-500/30 transition-all">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Laptop className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Live Browser Workspace</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Interactive tldraw canvas on <code className="text-cyan-300 text-[11px]">http://localhost:4747</code> updates smoothly in real time via live Server-Sent Events (SSE).
            </p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Live SSE Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
}
