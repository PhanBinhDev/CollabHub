import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';

import { i18n } from './i18n-config';

function getLocale(request: NextRequest) {
  const headers = {
    'accept-language': request.headers.get('accept-language') ?? '',
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, i18n.locales, i18n.defaultLocale);
}

export function localizationMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    const localeInPath = i18n.locales.find(
      locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );
    const res = NextResponse.next();
    if (localeInPath) {
      res.cookies.set('locale', localeInPath, { path: '/', sameSite: 'lax' });
    }
    return res;
  }

  const locale = getLocale(request);
  const res = NextResponse.next();
  res.cookies.set('locale', locale, { path: '/', sameSite: 'lax' });
  return res;
}
