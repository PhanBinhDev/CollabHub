import '@/styles/globals.css';
import { enUS, viVN } from '@clerk/localizations';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import Modals from '@/components/modals';
import AuthRedirect from '@/components/shared/auth-redirect';
import PageLoader from '@/components/shared/loader';
import MultisessionAppSupport from '@/components/shared/multi-sessions';
import { DictionaryProvider } from '@/features/internationalization/dictionary-provider';
import { i18n, Locale } from '@/features/internationalization/i18n-config';
import { generateMetadata as generateMeta } from '@/lib/seo';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get('locale')?.value as Locale) ?? i18n.defaultLocale;
  return generateMeta({}, locale);
}

export default async function RootLayout({ children }: Readonly<IChildren>) {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get('locale')?.value as Locale) ?? i18n.defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <ClerkProvider
        localization={locale === 'vi' ? viVN : enUS}
        appearance={{
          variables: {
            borderRadius: '6px',
            fontFamily: "'Inter', sans-serif",
          },
          elements: {
            card: '!py-6 !px-8',
            footer: '!hidden',
            socialButtons: '!flex flex-col gap-3',
            buttonArrowIcon: '!hidden',
            logoImage: 'rounded-md',
            main: '!gap-2',
            modalCloseButton: 'focus:!shadow-none',
            modalBackdrop: '!items-center',
          },
        }}
        signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT_URL}
        signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_SIGN_UP_REDIRECT_URL}
        signInUrl={process.env.NEXT_PUBLIC_SIGN_IN_URL}
        signUpUrl={process.env.NEXT_PUBLIC_SIGN_UP_URL}
      >
        <body className={`${inter.className} antialiased`}>
          <MultisessionAppSupport>
            <DictionaryProvider>
              <PageLoader>
                <Suspense fallback={null}>
                  <AuthRedirect />
                </Suspense>
                <ConvexClientProvider>
                  <Toaster />
                  <Modals />
                  {children}
                </ConvexClientProvider>
              </PageLoader>
            </DictionaryProvider>
          </MultisessionAppSupport>
        </body>
      </ClerkProvider>
    </html>
  );
}
