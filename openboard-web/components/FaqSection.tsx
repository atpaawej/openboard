'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqSchema } from './JsonLd';
import { TechnicalFrame, SectionFrame } from './ui/TechnicalFrame';
import { SectionHeader } from './ui/SectionHeader';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
      <FaqSchema faqs={faqs} />
      <TechnicalFrame maxWidth="lg" withOuterBorders withTicks withGuides>
        {/* Header Region */}
        <div className="px-6 py-10 sm:px-10 border-b border-white/[0.08]">
          <SectionHeader
            index="08 // FAQ"
            eyebrow="No Secrets, No Jargon"
            eyebrowVariant="blue"
            title="Frequently Asked Questions"
            description="Clear, honest answers about technical privacy, local SQLite persistence, Model Context Protocol, and open-source guarantees."
            align="left"
          />
        </div>

        {/* FAQ Accordion List with Shared Borders */}
        <div className="divide-y divide-white/[0.06] bg-[#0c0d10]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="transition-colors bg-[#0c0d10] hover:bg-[#121318]"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  type="button"
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-zinc-100 hover:text-white cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500">{String(idx + 1).padStart(2, '0')}</span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.06] pt-4 pl-12 bg-[#121318]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </TechnicalFrame>
    </SectionFrame>
  );
}
