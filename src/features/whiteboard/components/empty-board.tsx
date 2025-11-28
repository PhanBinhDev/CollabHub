'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { IconBackground, IconPlus } from '@tabler/icons-react';

const EmptyBoard = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBackground />
        </EmptyMedia>
        <EmptyTitle>
          <TranslateText value="whiteboard.empty.title" />
        </EmptyTitle>
        <EmptyDescription>
          <TranslateText value="whiteboard.empty.description" />
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <IconPlus className="mr-1 h-4 w-4" />
          <TranslateText value="whiteboard.createBoard" />
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyBoard;
