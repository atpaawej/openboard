'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
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
  Lock,
  Zap,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { siteConfig } from '@/lib/siteConfig';
import { Button } from './ui/Button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFeaturesOpen(false);
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
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-x border-white/[0.08]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-[#181920] border border-blue-500/40 flex items-center justify-center group-hover:border-blue-500/70 transition-colors shadow-sm">
            <span className="text-blue-400 text-xs font-bold font-mono">OB</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight group-hover:text-blue-300 transition-colors">
              OpenBoard
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-zinc-300">
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
              <span>Features</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                  featuresOpen ? 'rotate-180 text-blue-400' : ''
                }`}
              />
            </button>

            {/* Mega Menu Dropdown */}
            {featuresOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[720px] rounded-md bg-[#121318] border border-white/[0.12] p-6 shadow-2xl grid grid-cols-12 gap-6 animate-in fade-in duration-100">
                {/* Column 1: Core Architecture & Privacy */}
                <div className="col-span-6 space-y-3">
                  <div className="text-[11px] font-mono uppercase font-bold text-blue-400 tracking-wider pb-1 border-b border-white/[0.08] flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Local Storage &amp; Privacy</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/features"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded hover:bg-white/[0.04] transition-colors block group"
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-zinc-200 group-hover:text-white">
                        <Lock className="w-3.5 h-3.5 text-blue-400" />
                        <span>100% Local SQLite Storage</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        All diagrams stored in ~/.openboard/openboard.db with zero cloud leaks.
                      </p>
                    </Link>

                    <Link
                      href="/features"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded hover:bg-white/[0.04] transition-colors block group"
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-zinc-200 group-hover:text-white">
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Real-Time SSE Live Sync</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        Terminal agent mutations stream instantly into your browser canvas.
                      </p>
                    </Link>

                    <Link
                      href="/features"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded hover:bg-white/[0.04] transition-colors block group"
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-zinc-200 group-hover:text-white">
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>Headless Vector SVG Engine</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        Export pixel-perfect vector SVGs in sub-5ms without heavy browsers.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 2: AI Agents & MCP */}
                <div className="col-span-6 space-y-3">
                  <div className="text-[11px] font-mono uppercase font-bold text-blue-400 tracking-wider pb-1 border-b border-white/[0.08] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>AI Coding Agents (MCP)</span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/docs/mcp-tools"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded hover:bg-white/[0.04] transition-colors block group"
                    >
                      <div className="font-semibold text-xs text-zinc-200 group-hover:text-white">
                        13 Semantic MCP Tools
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        Structured tools for autonomous visual diagramming.
                      </p>
                    </Link>

                    <Link
                      href="/integrations/claude-code"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded hover:bg-white/[0.04] transition-colors block group"
                    >
                      <div className="font-semibold text-xs text-zinc-200 group-hover:text-white">
                        Claude Code Integration
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        Direct CLI stdio protocol for terminal pair programming.
                      </p>
                    </Link>

                    <Link
                      href="/integrations/cursor"
                      onClick={() => setFeaturesOpen(false)}
                      className="p-2.5 rounded hover:bg-white/[0.04] transition-colors block group"
                    >
                      <div className="font-semibold text-xs text-zinc-200 group-hover:text-white">
                        Cursor IDE &amp; Codex
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                        Visual architecture generation directly inside your editor.
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/docs" className="hover:text-white transition-colors flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span>Docs</span>
          </Link>
          <Link href="/compare" className="hover:text-white transition-colors">
            <span>Compare</span>
          </Link>
          <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-zinc-400" />
            <span>Blog</span>
          </Link>
          <Link href="/security" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Security</span>
          </Link>
        </nav>

        {/* Right CTA Area */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-[#161720] hover:bg-[#1e2029] border border-white/[0.08] hover:border-white/[0.18] rounded transition-all"
          >
            <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span>Star</span>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#1f222e] text-blue-300 font-mono text-[10px]">
              <Star className="w-2.5 h-2.5 fill-blue-400 text-blue-400" />
              <span>GitHub</span>
            </span>
          </a>

          <Button
            href="/docs/quickstart"
            variant="brand"
            size="sm"
            iconRight={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Quickstart
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-400 hover:text-white"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white rounded focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-zinc-300" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#121318] px-4 pt-3 pb-6 space-y-3">
          <div>
            <button
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium text-zinc-200 hover:bg-white/[0.04] hover:text-white"
            >
              <span>Features</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileFeaturesOpen ? 'rotate-180 text-blue-400' : ''
                }`}
              />
            </button>
            {mobileFeaturesOpen && (
              <div className="pl-4 pr-2 py-2 space-y-1 text-xs bg-[#0c0d10] rounded my-1 border border-white/[0.06]">
                <Link
                  href="/features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-zinc-300 hover:text-white"
                >
                  All Features Overview
                </Link>
                <Link
                  href="/docs/mcp-tools"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-zinc-300 hover:text-white"
                >
                  13 Semantic MCP Tools
                </Link>
                <Link
                  href="/integrations/claude-code"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-zinc-300 hover:text-white"
                >
                  Claude Code Integration
                </Link>
                <Link
                  href="/integrations/cursor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-zinc-300 hover:text-white"
                >
                  Cursor IDE Integration
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-zinc-200 hover:bg-white/[0.04] hover:text-white"
          >
            Documentation
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-zinc-200 hover:bg-white/[0.04] hover:text-white"
          >
            Compare Alternatives
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-zinc-200 hover:bg-white/[0.04] hover:text-white"
          >
            Blog &amp; Knowledge Base
          </Link>
          <Link
            href="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-zinc-200 hover:bg-white/[0.04] hover:text-white"
          >
            Security Whitepaper
          </Link>
          <div className="pt-2">
            <Button
              href="/docs/quickstart"
              variant="brand"
              size="md"
              className="w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started with Quickstart
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
