'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Locale } from '@/features/internationalization/i18n-config';

export async function setLocaleAction(locale: Locale) {
  const cookieStore = await cookies();
  
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  });
  
  revalidatePath('/', 'layout');
}