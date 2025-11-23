'use client';

import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChangeLanguage } from './change-language';
import TranslateText from './translate/translate-text';
import { UserMenu } from './user-menu';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-50
        flex items-center justify-between
        px-4 py-2.5 md:px-6 md:py-3
        rounded-full md:rounded-2xl
        max-w-7xl mx-auto
        transition-all duration-300
        ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl border border-gray-200/50 shadow-lg shadow-black/5'
            : 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm'
        }
      `}
    >
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-lg md:text-xl hover:opacity-80 transition-opacity"
      >
        <div className="relative">
          <Image
            src="/logo.png"
            alt="CollabHub"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity -z-10" />
        </div>
        <span className="hidden md:block bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          <TranslateText value="app.name" />
        </span>
      </Link>

      <nav className="flex items-center gap-1 md:gap-1.5">
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant="ghost"
            asChild
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-xl"
          >
            <Link href="/features">
              <TranslateText value="nav.features" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-xl"
          >
            <Link href="/apps">
              <TranslateText value="nav.app" />
            </Link>
          </Button>

          <div className="w-px h-6 bg-gray-300/50 mx-2" />

          <ChangeLanguage />

          <Unauthenticated>
            <SignInButton mode="modal">
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl">
                <TranslateText value="nav.getStarted" />
              </Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <UserMenu />
          </Authenticated>
        </div>

        {/* Mobile navigation */}
        <div className="flex md:hidden items-center gap-1.5">
          <ChangeLanguage />
          <Unauthenticated>
            <SignInButton mode="modal">
              <Button
                size="sm"
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl hover:shadow-lg transition-all shadow-sm"
              >
                <TranslateText value="nav.getStarted" />
              </Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <UserMenu />
          </Authenticated>
        </div>
      </nav>
    </header>
  );
}
