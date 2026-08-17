'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { DocItem, docsData } from '@/lib/content';
import { MarkdownContent } from './MarkdownContent';
import { BreadcrumbSchema, TechArticleSchema } from './JsonLd';
import {
  BookOpen,
  Search,
  ChevronRight,
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Terminal,
  Cpu,
  Database,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { siteConfig } from '@/lib/siteConfig';

interface DocsLayoutProps {
  currentDoc: DocItem;
}

export function DocsLayout({ currentDoc }: DocsLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>('');

  const categories = [
    'Getting Started',
    'Core Concepts',
    'MCP & AI Agents',
    'Configuration & CLI',
    'Help & Reference',
  ] as const;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Getting Started':
        return Terminal;
      case 'Core Concepts':
        return Database;
      case 'MCP & AI Agents':
        return Cpu;
      case 'Configuration & CLI':
        return Layers;
      case 'Help & Reference':
        return HelpCircle;
      default:
        return BookOpen;
    }
  };

  // Filter docs by search query
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return docsData;
    const q = searchQuery.toLowerCase();
    return docsData.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const currentIndex = docsData.findIndex((d) => d.slug === currentDoc.slug);
  const prevDoc = currentIndex > 0 ? docsData[currentIndex - 1] : null;
  const nextDoc = currentIndex < docsData.length - 1 ? docsData[currentIndex + 1] : null;

  // Active TOC scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const headings = currentDoc.toc.map((t) => document.getElementById(t.id)).filter(Boolean);
      for (const heading of headings) {
        if (!heading) continue;
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 0) {
          setActiveTocId(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentDoc]);

  // Keyboard shortcut Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('docs-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyPage = () => {
    const markdown = `# ${currentDoc.title}\n\n${currentDoc.subtitle}\n\n${currentDoc.content}`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] bg-[#0c0d10] text-[#f3f4f6] flex flex-col">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Docs', url: '/docs' },
          { name: currentDoc.title, url: `/docs/${currentDoc.slug}` },
        ]}
      />
      <TechArticleSchema
        title={currentDoc.title}
        description={currentDoc.description}
        datePublished={currentDoc.lastUpdated}
        url={`/docs/${currentDoc.slug}`}
      />

      {/* Main Fullscreen 3-Column Layout */}
      <div className="w-full flex-1 flex flex-col lg:flex-row">
        {/* Mobile Navigation Toggle Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-[#121318] border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <span className="text-blue-400 font-semibold">{currentDoc.category} //</span>
            <span className="truncate max-w-[200px] text-white">{currentDoc.title}</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            type="button"
            className="p-1.5 rounded bg-white/[0.06] text-zinc-200 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* 1. Left Sticky Sidebar (Full Height, Edge-to-Edge) */}
        <aside
          className={`w-full lg:w-72 xl:w-80 shrink-0 border-r border-white/[0.08] bg-[#0c0d10] ${
            mobileNavOpen ? 'block' : 'hidden'
          } lg:block lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto p-4 space-y-6 scrollbar-thin z-20`}
        >
          {/* Quick Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="docs-search-input"
              type="text"
              placeholder="Search docs... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 bg-[#121318] border border-white/[0.08] rounded text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Navigation Categories */}
          <nav className="space-y-6 text-xs font-sans">
            {categories.map((cat) => {
              const items = filteredDocs.filter((d) => d.category === cat);
              if (items.length === 0) return null;
              const CatIcon = getCategoryIcon(cat);

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center gap-2 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold select-none">
                    <CatIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>{cat}</span>
                  </div>

                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const isActive = item.slug === currentDoc.slug;
                      return (
                        <Link
                          key={item.slug}
                          href={`/docs/${item.slug}`}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center justify-between px-3 py-1.5 rounded text-xs transition-all ${
                            isActive
                              ? 'bg-[#181920] text-blue-300 font-bold border-l-2 border-blue-500 pl-2.5 shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* 2. Center Main Article Area (Expansive & Readable) */}
        <main className="flex-1 min-w-0 px-6 sm:px-12 lg:px-16 py-10 max-w-4xl mx-auto lg:mx-0">
          <div className="space-y-8">
            {/* Top Breadcrumbs & Copy Page Action */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06] text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Link href="/docs" className="hover:text-white transition-colors">
                  Docs
                </Link>
                <span>/</span>
                <span className="text-blue-400 font-semibold">{currentDoc.category}</span>
                <span>/</span>
                <span className="text-zinc-200 truncate max-w-[200px]">{currentDoc.title}</span>
              </div>

              <button
                onClick={handleCopyPage}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#121318] border border-white/[0.08] hover:border-white/[0.18] text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy page</span>
                  </>
                )}
              </button>
            </div>

            {/* Document Header */}
            <header className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {currentDoc.title}
              </h1>

              {/* Overview Callout Banner */}
              <div className="p-4 sm:p-5 rounded-md bg-[#121318] border border-white/[0.08] text-sm text-zinc-300 leading-relaxed font-normal">
                {currentDoc.subtitle}
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-400 font-mono pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentDoc.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Last updated: {currentDoc.lastUpdated}</span>
                </div>
              </div>
            </header>

            {/* Main Content Markdown Render */}
            <article className="pt-4 border-t border-white/[0.08]">
              <MarkdownContent content={currentDoc.content} />
            </article>

            {/* Bottom Pagination Controls */}
            <div className="pt-10 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevDoc ? (
                <Link
                  href={`/docs/${prevDoc.slug}`}
                  className="p-4 rounded-md bg-[#121318] border border-white/[0.08] hover:border-blue-500/40 hover:bg-[#161720] transition-all space-y-1 group"
                >
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Previous</span>
                  </div>
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white truncate">
                    {prevDoc.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextDoc ? (
                <Link
                  href={`/docs/${nextDoc.slug}`}
                  className="p-4 rounded-md bg-[#121318] border border-white/[0.08] hover:border-blue-500/40 hover:bg-[#161720] transition-all space-y-1 text-right group sm:col-start-2"
                >
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-end gap-1">
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white truncate">
                    {nextDoc.title}
                  </div>
                </Link>
              ) : null}
            </div>

            {/* Feedback & GitHub Links */}
            <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span>Was this page helpful?</span>
                <button
                  type="button"
                  onClick={() => alert('Thanks for your feedback!')}
                  className="px-2 py-1 rounded bg-[#161720] border border-white/[0.08] hover:text-white transition-colors"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => alert('Thanks for your feedback! Please open an issue on GitHub if you need assistance.')}
                  className="px-2 py-1 rounded bg-[#161720] border border-white/[0.08] hover:text-white transition-colors"
                >
                  No
                </button>
              </div>

              <a
                href={`${siteConfig.githubUrl}/tree/main/openboard-web/lib/content.ts`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Edit this page on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* In-Docs Clean Mini Footer */}
            <div className="pt-8 mt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-mono gap-2">
              <p>© {new Date().getFullYear()} OpenBoard. 100% Free &amp; MIT Licensed.</p>
              <p>Database: <span className="text-zinc-400">~/.openboard/openboard.db</span></p>
            </div>
          </div>
        </main>

        {/* 3. Right Table of Contents (Sticky TOC) */}
        <aside className="w-64 xl:w-72 shrink-0 hidden xl:block border-l border-white/[0.08] bg-[#0c0d10] sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono pb-2 border-b border-white/[0.08]">
              On This Page
            </div>

            <ul className="space-y-1.5 text-xs">
              {currentDoc.toc.map((item) => {
                const isActive = activeTocId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block py-1 leading-snug transition-colors ${
                        isActive
                          ? 'text-blue-400 font-semibold pl-1 border-l-2 border-blue-400'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-3 text-xs">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
              Resources
            </div>
            <ul className="space-y-2 text-zinc-400 font-sans">
              <li>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Star on GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.discussions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Ask in Discussions</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.issues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-2 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Report an Issue</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
