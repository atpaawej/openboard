import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { siteConfig } from '@/lib/siteConfig';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#0c0d10] text-zinc-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-x border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#181920] border border-blue-500/40 flex items-center justify-center">
                <span className="text-blue-400 text-xs font-bold font-mono">OB</span>
              </div>
              <span className="font-bold text-white text-base tracking-tight">OpenBoard</span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              The 100% private, local-first infinite whiteboard workspace. Engineered with an embedded SQLite persistence layer and 13 Model Context Protocol (MCP) semantic tools for Claude Code, Cursor, Codex, and autonomous AI agents.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-[#161720] hover:bg-[#1e2029] text-zinc-300 hover:text-white transition-colors border border-white/[0.08]"
                aria-label="OpenBoard GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.npmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded bg-[#161720] hover:bg-[#1e2029] text-zinc-300 hover:text-white transition-colors border border-white/[0.08] font-mono text-xs"
                aria-label="OpenBoard npm Package"
              >
                npm: openboard-app
              </a>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider font-mono">Documentation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/docs/quickstart" className="hover:text-white transition-colors">
                  Quickstart Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/mcp-tools" className="hover:text-white transition-colors">
                  13 Semantic MCP Tools
                </Link>
              </li>
              <li>
                <Link href="/docs/agent-setup" className="hover:text-white transition-colors">
                  AI Agent Setup
                </Link>
              </li>
              <li>
                <Link href="/docs/architecture" className="hover:text-white transition-colors">
                  Architecture &amp; SQLite
                </Link>
              </li>
              <li>
                <Link href="/docs/cli-reference" className="hover:text-white transition-colors">
                  CLI Reference
                </Link>
              </li>
              <li>
                <Link href="/docs/shortcuts" className="hover:text-white transition-colors">
                  Keyboard Shortcuts
                </Link>
              </li>
            </ul>
          </div>

          {/* SEO Comparisons & Alternative Pages */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider font-mono">Compare Alternatives</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/compare/openboard-vs-excalidraw" className="hover:text-white transition-colors">
                  OpenBoard vs Excalidraw
                </Link>
              </li>
              <li>
                <Link href="/compare/openboard-vs-miro" className="hover:text-white transition-colors">
                  OpenBoard vs Miro
                </Link>
              </li>
              <li>
                <Link href="/compare/openboard-vs-tldraw" className="hover:text-white transition-colors">
                  OpenBoard vs tldraw
                </Link>
              </li>
              <li>
                <Link href="/integrations/claude-code" className="hover:text-white transition-colors">
                  Claude Code Integration
                </Link>
              </li>
              <li>
                <Link href="/integrations/cursor" className="hover:text-white transition-colors">
                  Cursor IDE Integration
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust, Security & Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider font-mono">Trust &amp; Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security &amp; Local Sandbox
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (Zero Telemetry)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service (MIT)
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.links.discussions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Discussions</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.issues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Report an Issue</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Keyword Anchor Cloud */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <p className="text-[11px] text-zinc-500 mb-3 font-mono uppercase tracking-wider">
            Engineering Knowledge &amp; Search Queries
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              OpenBoard
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/blog/open-source-whiteboard-guide" className="hover:text-blue-400 transition-colors">
              Open Source Whiteboard
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/security" className="hover:text-blue-400 transition-colors">
              Air-Gapped Local Whiteboard
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/docs/mcp-tools" className="hover:text-blue-400 transition-colors">
              Model Context Protocol Canvas
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/integrations/claude-code" className="hover:text-blue-400 transition-colors">
              Claude Code Whiteboard
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/integrations/cursor" className="hover:text-blue-400 transition-colors">
              Cursor IDE MCP Whiteboard
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/compare/openboard-vs-excalidraw" className="hover:text-blue-400 transition-colors">
              Excalidraw Alternative
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/compare/openboard-vs-miro" className="hover:text-blue-400 transition-colors">
              Miro Open Source Alternative
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/blog/why-local-first-whiteboards-matter" className="hover:text-blue-400 transition-colors">
              Local-First SQLite Architecture
            </Link>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4 font-mono">
          <p>© {new Date().getFullYear()} OpenBoard. Built for developers &amp; AI agents under the MIT License.</p>
          <p className="flex items-center gap-1 text-zinc-400 font-sans">
            Maintained by <a href={siteConfig.links.author} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white underline decoration-zinc-600 underline-offset-4">{siteConfig.creator}</a> &amp; OpenBoard Contributors
          </p>
        </div>
      </div>
    </footer>
  );
}
