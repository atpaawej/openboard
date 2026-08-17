'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export function CopyButton({ text, className = '', label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
        copied
          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
          : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
      } ${className}`}
      title="Copy to clipboard"
      aria-label={label || 'Copy code to clipboard'}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
          <span>{label || 'Copy'}</span>
        </>
      )}
    </button>
  );
}
