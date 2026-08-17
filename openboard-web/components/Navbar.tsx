'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Layers,
  Shield,
  FileText,
  Menu,
  X,
  ArrowRight,
  Star,
  ChevronDown,
  Database,
  Cpu,
  Eye,
  Radio,
  Terminal,
  Code2,
  Lock,
  Zap,
  FolderSync
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { siteConfig } from '@/lib/siteConfig';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mega menu on Esc or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFeaturesOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setFeaturesOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setFeaturesOpen(false);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0c0d10]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#14151a] border border-blue-500/30 flex items-center justify-center group-hover:border-blue-500/60 transition-colors shadow-sm shadow-blue-500/10">
            <span className="text-blue-400 text-lg font-bold">✦</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-100 text-lg tracking-tight group-hover:text-white transition-colors">
              OpenBoard
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links with Multi-Column Features Mega Menu */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-300">
          {/* Features Mega Menu Trigger */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className={`flex items-center gap-1.5 py-2 hover:text-white transition-colors cursor-pointer ${
                featuresOpen ? 'text-white' : ''
              }`}
              aria-expanded={featuresOpen}
              aria-haspopup="true"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Features</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                  featuresOpen ? 'rotate-180 text-blue-400' : ''
                }`}
              />
            </button>

            {/* Mega Menu Dropdown */}
            {featuresOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[760px] rounded-2xl bg-[#0e0f15]/95 border border-white/10 p-6 shadow-2xl backdrop-blur-2xl grid grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-150">
                {/* Column 1: Core Architecture & Privacy */}
                <div className="col-span-5 space-y-3">
                  <div className="text-[11px] font-mono uppercase font-bold text-blue-400 tracking-wider pb-1 border-b border-white/5 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Core &amp; Local Storage</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/features"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-white/5 transition-colors block group"
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-gray-100 group-hover:text-blue-300">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>100% Local SQLite Persistence</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        All diagrams stored locally in ~/.openboard/openboard.db with zero cloud leaks.
                      </p>
                    </Link>

                    <Link
                      href="/features"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-white/5 transition-colors block group"
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-gray-100 group-hover:text-blue-300">
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Real-Time SSE Live Sync</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        Agent mutations stream instantly into your browser canvas via Server-Sent Events.
                      </p>
                    </Link>

                    <Link
                      href="/features"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-white/5 transition-colors block group"
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-gray-100 group-hover:text-blue-300">
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>Headless Vector SVG Engine</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        Export pixel-perfect vector SVGs in sub-5ms without headless browsers.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 2: AI Agents & MCP */}
                <div className="col-span-4 space-y-3">
                  <div className="text-[11px] font-mono uppercase font-bold text-purple-400 tracking-wider pb-1 border-b border-white/5 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>AI Agents &amp; MCP</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/docs/mcp-tools"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-white/5 transition-colors block group"
                    >
                      <div className="font-semibold text-xs text-gray-100 group-hover:text-purple-300">
                        13 Semantic MCP Tools
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        High-level tools for autonomous visual diagramming.
                      </p>
                    </Link>

                    <Link
                      href="/integrations/claude-code"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-white/5 transition-colors block group"
                    >
                      <div className="font-semibold text-xs text-gray-100 group-hover:text-purple-300">
                        Claude Code Integration
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        Direct CLI stdio protocol for terminal pair programming.
                      </p>
                    </Link>

                    <Link
                      href="/integrations/cursor"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-white/5 transition-colors block group"
                    >
                      <div className="font-semibold text-xs text-gray-100 group-hover:text-purple-300">
                        Cursor IDE &amp; Codex
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        Visual architecture generation in your code editor.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Quickstart Spotlight Card */}
                <div className="col-span-3 rounded-xl bg-[#14151c] border border-blue-500/20 p-3.5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-blue-400 font-semibold">
                      <Sparkles className="w-3 h-3" />
                      <span>Instant Launch</span>
                    </div>
                    <div className="font-mono text-xs text-gray-200 bg-[#0c0d10] p-2 rounded-lg border border-white/5">
                      $ npx openboard-app start
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      100% Free &amp; MIT Licensed.
                    </p>
                  </div>

                  <Link
                    href="/features"
                    onClick={() => setFeaturesOpen(false)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center justify-between pt-2 border-t border-white/5"
                  >
                    <span>All Features</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/docs"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-gray-400" />
            Docs
          </Link>
          <Link
            href="/compare"
            className="hover:text-white transition-colors"
          >
            Compare
          </Link>
          <Link
            href="/blog"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-gray-400" />
            Blog
          </Link>
          <Link
            href="/security"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            Security
          </Link>
        </nav>

        {/* Right CTA Area */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-gray-200 bg-[#16171e] hover:bg-[#1e2029] border border-white/10 hover:border-blue-500/40 rounded-lg transition-all shadow-sm active:scale-[0.98]"
          >
            <GithubIcon className="w-4 h-4 text-gray-300" />
            <span>Star on GitHub</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-blue-300 font-mono text-[11px]">
              <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
              <span>atpaawej</span>
            </span>
          </a>

          <Link
            href="/docs/quickstart"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98]"
          >
            <span>Quickstart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-white"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gray-300" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0e0f14] px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
          <div>
            <button
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Features</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileFeaturesOpen ? 'rotate-180 text-blue-400' : ''}`} />
            </button>
            {mobileFeaturesOpen && (
              <div className="pl-6 pr-2 py-2 space-y-1.5 text-sm bg-[#121318] rounded-xl my-1 border border-white/5">
                <Link
                  href="/features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-gray-300 hover:text-white"
                >
                  ✦ All Features Overview
                </Link>
                <Link
                  href="/docs/mcp-tools"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-gray-300 hover:text-white"
                >
                  ✦ 13 Semantic MCP Tools
                </Link>
                <Link
                  href="/integrations/claude-code"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-gray-300 hover:text-white"
                >
                  ✦ Claude Code Integration
                </Link>
                <Link
                  href="/integrations/cursor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-gray-300 hover:text-white"
                >
                  ✦ Cursor IDE Integration
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white"
          >
            Documentation
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white"
          >
            Compare Alternatives
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white"
          >
            Blog &amp; Knowledge Base
          </Link>
          <Link
            href="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white"
          >
            Security Whitepaper
          </Link>
          <div className="pt-2">
            <Link
              href="/docs/quickstart"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm shadow-blue-600/20 active:scale-[0.98]"
            >
              Get Started with Quickstart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
