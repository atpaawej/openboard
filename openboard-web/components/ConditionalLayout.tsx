'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DocsNavbar } from './DocsNavbar';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isDocs = pathname?.startsWith('/docs');

  if (isDocs) {
    return (
      <>
        <DocsNavbar />
        <main className="flex-1 w-full min-h-[calc(100vh-6rem)]">{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}
