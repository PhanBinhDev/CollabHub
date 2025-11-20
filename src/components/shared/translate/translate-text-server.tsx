import {
  DictKey,
  getDictionary,
} from '@/features/internationalization/get-dictionaries';
import { i18n, Locale } from '@/features/internationalization/i18n-config';
import { getByPath } from '@/utils';
import { cookies } from 'next/headers';

export async function TranslateTextServer({ value }: { value: DictKey }) {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get('locale')?.value as Locale) ?? i18n.defaultLocale;
  const dict = await getDictionary(locale);
  const translated = getByPath(dict, value) ?? value;

  return <>{translated}</>;
}
