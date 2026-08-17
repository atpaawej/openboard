'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GithubIcon } from '@/components/icons';
import { siteConfig } from '@/lib/siteConfig';
import { docsData } from '@/lib/content';
import { Search, ExternalLink, ArrowLeft, Star, BookOpen } from 'lucide-react';

export function DocsNavbar() {
  const pathname = usePathname();

  const categories = [
    'Getting Started',
    'Core Concepts',
    'MCP & AI Agents',
    'Configuration & CLI',
    'Help & Reference',
  ] as const;

  // Identify active category from pathname
  const currentDocSlug = pathname?.replace('/docs/', '').replace('/docs', '') || 'overview';
  const currentDoc = docsData.find((d) => d.slug === currentDocSlug) || docsData[0];
  const activeCategory = currentDoc?.category || 'Getting Started';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0c0d10]/95 backdrop-blur-md border-b border-white/[0.08]">
      {/* Top Row: Docs Brand, Search, & Navigation Links */}
      <div className="w-full px-4 sm:px-8 h-14 flex items-center justify-between gap-4 border-b border-white/[0.06]">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded bg-[#181920] border border-blue-500/40 flex items-center justify-center group-hover:border-blue-500/70 transition-colors shadow-sm">
              <span className="text-blue-400 text-xs font-bold font-mono">OB</span>
            </div>
            <span className="font-bold text-white text-sm sm:text-base tracking-tight group-hover:text-blue-300 transition-colors">
              OpenBoard
            </span>
          </Link>
          <span className="text-zinc-600 text-xs font-mono select-none">/</span>
          <Link
            href="/docs"
            className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/25"
          >
            DOCS
          </Link>
        </div>

        {/* Center: Search Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={() => document.getElementById('docs-search-input')?.focus()}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-[#121318] border border-white/[0.08] hover:border-white/[0.18] text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Search documentation...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#181920] border border-white/[0.08] text-[10px] font-mono text-zinc-500">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Action Links */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Main Website</span>
          </Link>

          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161720] hover:bg-[#1e2029] text-zinc-200 hover:text-white transition-colors border border-white/[0.08]"
          >
            <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">Star</span>
            <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-[#1f222e] text-blue-300 font-mono text-[10px]">
              <Star className="w-2.5 h-2.5 fill-blue-400 text-blue-400" />
              <span>GitHub</span>
            </span>
          </a>
        </div>
      </div>

      {/* Bottom Row: Category Navigation Tabs */}
      <div className="w-full px-4 sm:px-8 h-10 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none bg-[#0c0d10]">
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          {categories.map((cat) => {
            const firstInCat = docsData.find((d) => d.category === cat);
            const isSelected = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={`/docs/${firstInCat?.slug || 'overview'}`}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#181920] text-blue-400 font-semibold border border-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-zinc-500 shrink-0">
          <span className="px-2 py-0.5 rounded bg-[#14161f] border border-white/[0.06] text-zinc-400">
            v0.1.0 • Local SQLite
          </span>
        </div>
      </div>
    </header>
  );
}
