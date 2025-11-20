import { DictKey } from '@/features/internationalization/get-dictionaries';
import TranslateText from './translate-text';
import { TranslateTextServer } from './translate-text-server';

export default TranslateTextServer;

export { TranslateText as TranslateClient };

// Type export
export type { DictKey };
