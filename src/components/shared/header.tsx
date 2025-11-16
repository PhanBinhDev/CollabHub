'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import TranslateText from './translate-text';

export default function Header() {
  return (
    <header className="fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-50 flex items-center justify-between px-3 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-xl md:rounded-2xl shadow-lg max-w-7xl mx-auto">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-lg md:text-xl"
      >
        <Image
          src="/logo.png"
          alt="CollabHub"
          width={32}
          height={32}
          className="rounded-md"
        />
        <div className="hidden md:block">
          <TranslateText value="app.name" />
        </div>
      </Link>
      <nav className="flex items-center gap-1 md:gap-2">
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="#features" className="text-gray-700">
              <TranslateText value="nav.features" />
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#apps" className="text-gray-700">
              <TranslateText value="nav.app" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth">
              <TranslateText value="nav.getStarted" />
            </Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Button size="sm" asChild>
            <Link href="/auth">
              <TranslateText value="nav.getStarted" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
