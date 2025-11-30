import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { localizationMiddleware } from './features/internationalization/localization-middleware';

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/api/:path*',
  ],
};

const isProtectedRoute = createRouteMatcher(['/server', '/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const localizationResponse = localizationMiddleware(req);

  if (localizationResponse && localizationResponse.status === 307) {
    return localizationResponse;
  }

  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      const url = new URL('/', req.url);
      url.searchParams.set('sign-in', 'true');
      url.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return localizationResponse || NextResponse.next();
});
