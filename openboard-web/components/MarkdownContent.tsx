'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyButton } from './CopyButton';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-body space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = String(children);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return (
              <h2
                id={id}
                className="text-2xl sm:text-3xl font-extrabold text-white pt-8 pb-3 border-b border-white/10 scroll-mt-24 tracking-tight first:pt-0"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return (
              <h3
                id={id}
                className="text-xl sm:text-2xl font-bold text-gray-100 pt-6 pb-2 scroll-mt-24 tracking-tight"
              >
                {children}
              </h3>
            );
          },
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-gray-200 pt-4 pb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-relaxed my-3 font-normal">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2.5 my-4 list-disc list-outside pl-5 marker:text-blue-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2.5 my-4 list-decimal list-outside pl-5 marker:text-blue-400 marker:font-mono">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 pl-1 leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-2 border-blue-500 bg-[#121318] px-4 py-3 rounded-r-xl text-gray-300 italic border border-y-0 border-r-0 border-l-blue-500">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-8 border-white/10" />
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-white/10 bg-[#101116] shadow-md">
              <table className="w-full text-left text-xs sm:text-sm divide-y divide-white/10">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#14151c] text-gray-200 font-semibold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/5 text-gray-300">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="p-3 sm:p-4 text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 sm:p-4">
              {children}
            </td>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className);
            const codeString = String(children).replace(/\n$/, '');

            if (isBlock) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : 'text';

              return (
                <div className="relative my-5 rounded-xl bg-[#0c0d10] border border-white/10 overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#121318] text-[11px] font-mono text-gray-400">
                    <span className="uppercase text-blue-400 font-semibold">{language}</span>
                    <CopyButton text={codeString} label="Copy" />
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-gray-200 leading-relaxed">
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code className="px-1.5 py-0.5 rounded-md bg-[#161720] border border-white/10 font-mono text-[13px] text-blue-300 font-normal">
                {children}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/40 underline-offset-4 font-medium transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
