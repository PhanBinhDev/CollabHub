'use client';

import { getCookieLocale } from '@/utils/cookies';
import { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { Dict } from './get-dictionaries';
import { i18n, type Locale } from './i18n-config';
import { setLocaleAction } from './set-locale-server';
import { useRouter } from 'next/navigation';

type DictionaryContextType = {
  dict: Dict | null;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(
  undefined,
);

export function DictionaryProvider({
  children,
}: {
  children: React.ReactNode;
  }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
  const defaultLocale = (getCookieLocale() as Locale) ?? i18n.defaultLocale;
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [dict, setDict] = useState<Dict | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    import(`./dictionaries/${locale}`)
      .then(m => {
        if (mounted) {
          console.log('Dictionary loaded successfully:', locale);
          setDict(m.default ?? m);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error('Failed to load dictionary:', error);
        if (mounted) {
          setDict(null);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [locale]);

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    setLocaleState(newLocale);

    startTransition(async () => {
      await setLocaleAction(newLocale);
      router.refresh();
    });
  };

  return (
    <DictionaryContext.Provider value={{ dict, locale, setLocale, isLoading: isPending || isLoading }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useClientDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error(
      'useClientDictionary must be used within DictionaryProvider',
    );
  }
  return context;
}
