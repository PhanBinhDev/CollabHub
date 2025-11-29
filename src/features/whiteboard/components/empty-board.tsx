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
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { IconBackground, IconPlus } from '@tabler/icons-react';
import { useMutation } from 'convex/react';

const EmptyBoard = () => {
  const create = useMutation(api.boards.create);
  const { organization } = useOrganization();

  const onClick = () => {
    if (!organization) return;

    create({ title: 'New Board', orgId: organization?.id });
  };

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
        <Button onClick={onClick}>
          <IconPlus className="mr-1 h-4 w-4" />
          <TranslateText value="whiteboard.createBoard" />
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyBoard;
