'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DocItem, docsData } from '@/lib/content';
import { MarkdownContent } from './MarkdownContent';
import { BreadcrumbSchema, TechArticleSchema } from './JsonLd';
import { BookOpen, ChevronRight, Clock, Calendar, ArrowLeft, ArrowRight, Menu, X, Terminal, Cpu, Database, Layers } from 'lucide-react';
import { Button } from './ui/Button';

interface DocsLayoutProps {
  currentDoc: DocItem;
}

export function DocsLayout({ currentDoc }: DocsLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const categories = ['Getting Started', 'MCP & AI Agents', 'Architecture', 'Reference'] as const;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Getting Started':
        return Terminal;
      case 'MCP & AI Agents':
        return Cpu;
      case 'Architecture':
        return Database;
      case 'Reference':
        return Layers;
      default:
        return BookOpen;
    }
  };

  const currentIndex = docsData.findIndex((d) => d.slug === currentDoc.slug);
  const prevDoc = currentIndex > 0 ? docsData[currentIndex - 1] : null;
  const nextDoc = currentIndex < docsData.length - 1 ? docsData[currentIndex + 1] : null;

  return (
    <div className="py-8 sm:py-12">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Navigation Toggle Bar */}
        <div className="lg:hidden flex items-center justify-between p-3 rounded-xl bg-[#121318] border border-white/10 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
            <span className="text-blue-400">Docs /</span>
            <span className="font-semibold text-white truncate max-w-[200px]">{currentDoc.title}</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            aria-label="Toggle Docs Sidebar"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Sidebar Navigation */}
          <aside
            className={`lg:col-span-3 ${
              mobileNavOpen ? 'block' : 'hidden'
            } lg:block space-y-6`}
          >
            <div className="rounded-2xl bg-[#101116] border border-white/10 p-5 space-y-6 sticky top-24 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>Documentation</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400">
                  {docsData.length} guides
                </span>
              </div>

              <div className="space-y-6 text-xs">
                {categories.map((cat) => {
                  const items = docsData.filter((d) => d.category === cat);
                  const CatIcon = getCategoryIcon(cat);

                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-gray-400 font-semibold px-2">
                        <CatIcon className="w-3.5 h-3.5 text-gray-400" />
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
                              className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all ${
                                isActive
                                  ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30 shadow-sm font-semibold'
                                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                              }`}
                            >
                              <span className="truncate">{item.title}</span>
                              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Center Main Article Content */}
          <main className="lg:col-span-6 space-y-8 min-w-0">
            <header className="space-y-3 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                  {currentDoc.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {currentDoc.title}
              </h1>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {currentDoc.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono pt-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{currentDoc.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Updated {currentDoc.lastUpdated}</span>
                </div>
              </div>
            </header>

            {/* Markdown Body */}
            <div className="pt-2">
              <MarkdownContent content={currentDoc.content} />
            </div>

            {/* Next / Prev Navigation Controls */}
            <div className="pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevDoc ? (
                <Link
                  href={`/docs/${prevDoc.slug}`}
                  className="p-4 rounded-xl bg-[#121318] border border-white/5 hover:border-blue-500/30 hover:bg-[#161720] transition-all space-y-1 group"
                >
                  <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Previous</span>
                  </div>
                  <div className="font-semibold text-sm text-gray-200 group-hover:text-white truncate">
                    {prevDoc.title}
                  </div>
                </Link>
              ) : <div />}

              {nextDoc ? (
                <Link
                  href={`/docs/${nextDoc.slug}`}
                  className="p-4 rounded-xl bg-[#121318] border border-white/5 hover:border-blue-500/30 hover:bg-[#161720] transition-all space-y-1 text-right group sm:col-start-2"
                >
                  <div className="text-[11px] font-mono text-gray-400 flex items-center justify-end gap-1">
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-semibold text-sm text-gray-200 group-hover:text-white truncate">
                    {nextDoc.title}
                  </div>
                </Link>
              ) : null}
            </div>
          </main>

          {/* Right Floating Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="rounded-2xl bg-[#101116] border border-white/10 p-5 space-y-3 sticky top-24 shadow-xl">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider pb-2 border-b border-white/5">
                On This Page
              </div>
              <ul className="space-y-2 text-xs">
                {currentDoc.toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-gray-400 hover:text-blue-300 transition-colors block py-0.5 leading-snug"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-white/5 space-y-2.5">
                <div className="text-[11px] text-gray-400 font-mono">
                  Launch instantly:
                </div>
                <Button
                  href="/docs/quickstart"
                  size="sm"
                  variant="primary"
                  className="w-full justify-center"
                >
                  Quickstart
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
