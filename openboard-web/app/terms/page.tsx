import React from 'react';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { siteConfig } from '@/lib/siteConfig';
import { TechnicalFrame, SectionFrame } from '@/components/ui/TechnicalFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata = constructMetadata({
  title: 'Terms of Service — MIT Open Source License',
  description:
    'OpenBoard Terms of Service and MIT Open Source License terms.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="bg-[#0c0d10]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service', url: '/terms' },
        ]}
      />

      <SectionFrame withBottomRule withTopRule={false} className="bg-[#0c0d10]">
        <TechnicalFrame maxWidth="md" withOuterBorders withTicks withGuides>
          {/* Header */}
          <div className="p-6 sm:p-10 border-b border-white/[0.08]">
            <SectionHeader
              index="LEGAL // LICENSE"
              eyebrow="Permissive Open Source Terms"
              eyebrowVariant="blue"
              title="Terms of Service"
              description="Last updated: August 17, 2026"
              align="left"
            />
          </div>

          <div className="p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#0c0d10]">
            <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-tight">1. MIT License</h2>
            <p>
              OpenBoard is licensed under the permissive <strong className="text-white">MIT License</strong>. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software for personal, commercial, or academic purposes.
            </p>

            <div className="p-5 rounded bg-[#121318] border border-white/[0.08] font-mono text-xs text-zinc-300 space-y-3">
              <p className="font-bold text-white">MIT License</p>
              <p>Copyright (c) 2026 Aawej and OpenBoard Contributors</p>
              <p>
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the &quot;Software&quot;), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
              </p>
              <p>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>
              <p className="text-zinc-400">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-tight pt-2">2. Source Code Repository</h2>
            <p>
              The official canonical repository is hosted on GitHub at{' '}
              <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                github.com/atpaawej/openboard
              </a>
              . Contributions, pull requests, and bug reports are welcome.
            </p>
          </div>
        </TechnicalFrame>
      </SectionFrame>
    </div>
  );
}
