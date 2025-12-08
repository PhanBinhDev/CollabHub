'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import { BoardVisibilityValue, BoardWithMetadata } from '@/convex/boards';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { DictKey } from '@/features/internationalization/get-dictionaries';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { ViewType } from '@/types';
import {
  IconHeart,
  IconHeartFilled,
  IconLock,
  IconUsersGroup,
  IconWorld,
} from '@tabler/icons-react';
import Link from 'next/link';
import { toast } from 'sonner';
import BoardCardAction from './board-card-action';

const getVisibilityIcon = (visibility: BoardVisibilityValue) => {
  switch (visibility) {
    case 'private':
      return <IconLock size={14} className="text-gray-500" />;
    case 'public':
      return <IconWorld size={14} className="text-blue-500" />;
    case 'organization':
      return <IconUsersGroup size={14} className="text-green-500" />;
  }
};

interface BoardCardProps {
  board: BoardWithMetadata;
  view?: ViewType;
  isFavorite: boolean;
}

const BoardCard = ({ board, isFavorite, view = 'GRID' }: BoardCardProps) => {
  const { dict } = useClientDictionary();
  const { mutate: toggleFavoriteMutate } = useApiMutation(
    api.boards.toggleFavorite,
  );

  const toggleFavorite = () => {
    toggleFavoriteMutate({ boardId: board._id })
      .then(() => {
        toast.success(
          isFavorite
            ? dict?.whiteboard.boardCard.unstarSuccess
            : dict?.whiteboard.boardCard.starSuccess,
        );
      })
      .catch(() => {
        toast.error(dict?.whiteboard.boardCard.favoriteError);
      });
  };

  if (view === 'LIST') {
    return (
      <Item variant="outline" size={'sm'}>
        <ItemContent>
          <ItemTitle>
            <Link href={`/board/${board._id}`}> {board.title}</Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-1">
                  {getVisibilityIcon(board.visibility)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <TranslateText
                  value={
                    `whiteboard.boardCard.visibility.${board.visibility}` as DictKey
                  }
                />
              </TooltipContent>
            </Tooltip>
          </ItemTitle>
          <ItemDescription>
            Modified today by {board.authorName}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant={'ghost'}
            size="sm"
            className="size-8"
            onClick={toggleFavorite}
          >
            {isFavorite ? (
              <IconHeartFilled size={16} className="text-red-500" />
            ) : (
              <IconHeart size={16} />
            )}
          </Button>
          <BoardCardAction board={board} isFavorite={isFavorite} />
        </ItemActions>
      </Item>
    );
  }

  return (
    <div className="group aspect-100/127 border rounded-lg flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative flex-1 bg-amber-50">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant={'ghost'}
            size="sm"
            className="size-8"
            onClick={toggleFavorite}
          >
            {isFavorite ? (
              <IconHeartFilled size={16} className="text-red-500" />
            ) : (
              <IconHeart size={16} />
            )}
          </Button>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{board.title}</p>
          {getVisibilityIcon(board.visibility)}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {board.authorName}
        </p>
      </div>
    </div>
  );
};

export default BoardCard;
