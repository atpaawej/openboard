import React from 'react';
import { Lock, Cpu, Palette, Eye, Radio, Keyboard, Database, Sparkles } from 'lucide-react';

export function FeatureGrid() {
  const features = [
    {
      icon: Lock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      title: 'Local-First & 100% Private',
      description:
        'Zero cloud dependencies, zero telemetry, and zero mandatory accounts. All whiteboards, shapes, and metadata live in your local SQLite database (~/.openboard/openboard.db).'
    },
    {
      icon: Cpu,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      title: 'AI Agent Native (MCP)',
      description:
        'Built-in Model Context Protocol server exposing 13 semantic tools for Claude Code, Cursor, Codex, and OpenCode to create, inspect, and connect visual nodes.'
    },
    {
      icon: Palette,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      title: 'Twenty-Inspired Dark Workspace',
      description:
        'Aesthetic near-black surfaces (#0e0e11), electric blue accents (#2563eb), crisp vector shapes, and zero-dependency SVG iconography built for night owls.'
    },
    {
      icon: Eye,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      title: 'Headless Canvas Inspection',
      description:
        'AI agents can inspect visual element hierarchies and render pixel-perfect vector SVG snapshots in sub-5ms without needing a heavy headless browser.'
    },
    {
      icon: Radio,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      title: 'Live Browser Projection (SSE)',
      description:
        'When you have OpenBoard open in your browser, mutations from terminal coding agents stream seamlessly into your viewport in real time via Server-Sent Events.'
    },
    {
      icon: Keyboard,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      title: 'Keyboard-First Productivity',
      description:
        'Press N for new whiteboards, / to focus search, Esc to dismiss modals, Space+Drag to pan, and Cmd+D to duplicate shapes instantly.'
    }
  ];

  return (
    <section className="py-20 border-b border-white/5 bg-[#090a0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer-Grade Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Privacy, Speed, and Autonomy
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Every layer of OpenBoard is crafted to eliminate cloud friction and give developers complete visual control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#111217] border border-white/5 hover:border-white/15 transition-all space-y-3 group hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
