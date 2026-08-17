'use client';

import React, { useState } from 'react';
import { CopyButton } from '../CopyButton';

export interface TerminalTab {
  id: string;
  label: string;
  command: string;
  description?: string;
}

interface TerminalWindowProps {
  title?: string;
  tabs: TerminalTab[];
  defaultTab?: string;
  dbHint?: string;
  className?: string;
}

export function TerminalWindow({
  title = 'openboard-terminal',
  tabs,
  defaultTab,
  dbHint = 'Local SQLite: ~/.openboard/openboard.db',
  className = '',
}: TerminalWindowProps) {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTab || tabs[0]?.id || '');
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div
      className={`rounded-md border border-white/[0.12] bg-[#0c0d10] shadow-2xl overflow-hidden text-left ${className}`}
    >
      {/* Terminal Titlebar & Tabs */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.08] bg-[#121318]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[11px] font-mono text-zinc-400 ml-1.5 select-none">{title}</span>
        </div>

        {tabs.length > 1 && (
          <div className="flex items-center gap-1 bg-[#0c0d10] p-0.5 rounded border border-white/[0.06]">
            {tabs.map((tab) => {
              const isSelected = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  type="button"
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e2029] text-blue-300 font-semibold border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Terminal Body */}
      {activeTab && (
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4 font-mono text-xs sm:text-sm bg-[#0c0d10]">
          <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
            <span className="text-blue-400 font-bold select-none">$</span>
            <span className="text-zinc-100 whitespace-nowrap tracking-tight">{activeTab.command}</span>
          </div>
          <CopyButton text={activeTab.command} label="Copy" />
        </div>
      )}

      {/* Terminal Footer Info */}
      <div className="px-4 py-2 text-[11px] border-t border-white/[0.06] bg-[#101116] text-zinc-500 font-mono flex items-center justify-between flex-wrap gap-2">
        <span>{activeTab?.description || 'Instant execution in local terminal'}</span>
        {dbHint && <span className="text-zinc-400 text-[10px]">{dbHint}</span>}
      </div>
    </div>
  );
}
