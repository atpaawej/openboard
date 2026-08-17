import React from 'react';
import { constructMetadata } from '@/lib/seo';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { FileText, Shield } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

export const metadata = constructMetadata({
  title: 'Terms of Service — MIT Open Source License',
  description:
    'OpenBoard Terms of Service and MIT Open Source License terms.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service', url: '/terms' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Open Source License</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-500 font-mono">Last updated: August 17, 2026</p>
        </header>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white tracking-tight">1. MIT License</h2>
          <p>
            OpenBoard is licensed under the permissive <strong className="text-white">MIT License</strong>. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software for personal, commercial, or academic purposes.
          </p>

          <div className="p-5 rounded-xl bg-[#0c0d10] border border-white/10 font-mono text-xs text-gray-300 space-y-3">
            <p className="font-bold text-gray-100">MIT License</p>
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
            <p>
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">2. Source Code Repository</h2>
          <p>
            The official canonical repository is hosted on GitHub at{' '}
            <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              github.com/atpaawej/openboard
            </a>
            . Contributions, pull requests, and bug reports are welcome.
          </p>
        </div>
      </div>
    </div>
  );
}
