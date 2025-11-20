'use client';

import Translate from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { i18n, type Locale } from '@/features/internationalization/i18n-config';
import { useSwitchLocaleHref } from '@/features/internationalization/use-switch-locale-href';
import { Languages } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const languageNames: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
};

const languageFlags: Record<Locale, string> = {
  en: '🇺🇸',
  vi: '🇻🇳',
};

export function ChangeLanguage() {
  const params = useParams();
  const currentLocale = (params?.lang as Locale) || i18n.defaultLocale;
  const switchLocaleHref = useSwitchLocaleHref();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-5 w-5" />
          <span className="sr-only">
            <Translate value="common.changeLanguage" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {i18n.locales.map(locale => (
          <DropdownMenuItem key={locale} asChild>
            <Link
              href={switchLocaleHref(locale)}
              className={`flex items-center gap-2 ${
                currentLocale === locale ? 'bg-accent' : ''
              }`}
            >
              <span className="text-lg">{languageFlags[locale]}</span>
              <span>{languageNames[locale]}</span>
              {currentLocale === locale && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
