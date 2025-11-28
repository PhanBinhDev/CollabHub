import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import { ViewType } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';

interface HeaderBoardListProps {
  onCreate?: () => void;
  view?: ViewType;
  setView?: Dispatch<SetStateAction<ViewType>>;
}

export const HeaderBoardList = ({}: HeaderBoardListProps) => {
  return (
    <div className="flex justify-between items-center p-3">
      <h2 className="text-xl font-semibold">
        <TranslateText value="whiteboard.title" />
      </h2>

      <Button onClick={() => {}}>
        <IconPlus className="mr-1" />
        <TranslateText value="whiteboard.createBoard" />
      </Button>
    </div>
  );
};
