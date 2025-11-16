import { useClientDictionary } from '@/features/internationalization/use-client-dictionary';
import { getByPath } from '@/utils';

const TranslateText = ({ value }: { value: string }) => {
  const { dict } = useClientDictionary();

  const translated = getByPath(dict, value) ?? value;

  console.log('TranslateText:', { value, translated });

  return <>{translated}</>;
};

export default TranslateText;
