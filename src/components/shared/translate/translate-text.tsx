import { DictKey } from '@/features/internationalization/get-dictionaries';
import { useClientDictionary } from '@/features/internationalization/use-client-dictionary';
import { getByPath } from '@/utils';

const TranslateText = ({ value }: { value: DictKey }) => {
  const { dict } = useClientDictionary();

  const translated = getByPath(dict, value) ?? value;

  return <>{translated}</>;
};

export default TranslateText;
