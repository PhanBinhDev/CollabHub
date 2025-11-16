import { NextFetchEvent, NextRequest } from 'next/server';

import { convexAuthNextjsMiddleware } from '@convex-dev/auth/nextjs/server';
import { localizationMiddleware } from './features/internationalization/localization-middleware';

const convexMiddleware = convexAuthNextjsMiddleware();

// Matcher ignoring `/_next/` and `/api/` and svg files.
export const config = { matcher: ['/((?!api|_next|.*.svg$).*)'] };

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const localizationResponse = localizationMiddleware(request);

  if (localizationResponse) {
    return localizationResponse;
  }

  return convexMiddleware(request, event);
}
