'use client';

import React from 'react';
import { CopyButton } from '../CopyButton';

interface CodeSnippetProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeSnippet({
  code,
  language,
  filename,
  showCopy = true,
  className = '',
}: CodeSnippetProps) {
  return (
    <div
      className={`rounded-md border border-white/[0.10] bg-[#0c0d10] overflow-hidden text-left ${className}`}
    >
      {(filename || language || showCopy) && (
        <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-white/[0.06] bg-[#121318]">
          <div className="flex items-center gap-2">
            {filename ? (
              <span className="text-[11px] font-mono text-zinc-300">{filename}</span>
            ) : language ? (
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                {language}
              </span>
            ) : null}
          </div>
          {showCopy && <CopyButton text={code} label="Copy" />}
        </div>
      )}

      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-zinc-200 leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}
