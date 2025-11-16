'use client';
import { getCookieLocale } from '@/utils/cookies';
import { useEffect, useState } from 'react';
import { Dict } from './get-dictionaries';
import { i18n, type Locale } from './i18n-config';

export function useClientDictionary(initial?: Locale) {
  const defaultLocale =
    initial ?? (getCookieLocale() as Locale) ?? i18n.defaultLocale;
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [dict, setDict] = useState<Dict | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    import(`./dictionaries/${locale}.json`)
      .then(m => {
        if (mounted) {
          setDict(m.default ?? m);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setDict(null);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [locale]);

  return { dict, locale, setLocale, isLoading };
}