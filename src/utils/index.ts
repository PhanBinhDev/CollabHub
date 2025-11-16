/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dict } from '@/features/internationalization/get-dictionaries';

export function getByPath(
  obj: Dict | undefined | null,
  path: string,
): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}
