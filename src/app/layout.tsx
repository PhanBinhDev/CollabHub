import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import PageLoader from '@/components/shared/loader';
import { Locale } from '@/features/internationalization/i18n-config';
import { generateMetadata as generateMeta } from '@/lib/seo';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return generateMeta({}, lang);
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang={lang} suppressHydrationWarning={true}>
        <body className={`${inter.className} antialiased`}>
          <PageLoader>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </PageLoader>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
