'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import useModal from '@/hooks/use-modal';
import { ViewType } from '@/types';
import {
  IconCheck,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconLink,
  IconLock,
  IconLogout,
  IconPhoto,
  IconShare,
  IconStar,
  IconStarFilled,
  IconTrash,
  IconUsersGroup,
  IconWorld,
} from '@tabler/icons-react';
import Link from 'next/link';
import { toast } from 'sonner';

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
  const { mutate: updateVisibilityMutate } = useApiMutation(
    api.boards.updateVisibility,
  );
  const { openModal } = useModal();

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

  const handleShare = () => {
    toast.info('Share feature coming soon');
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/whiteboard/${board._id}`;
    navigator.clipboard.writeText(link);
    toast.success(dict?.whiteboard.boardCard.linkCopied);
  };

  const handleOpenNewTab = () => {
    window.open(`/whiteboard/${board._id}`, '_blank');
  };

  const handleRename = () => {
    openModal('UPDATE_NAME_BOARD', { board });
  };

  const handleDuplicate = () => {
    toast.info('Duplicate feature coming soon');
  };

  const handleDelete = () => {
    openModal('REMOVE_BOARD', {
      board,
    });
  };

  const handleChangeThumbnail = () => {
    toast.info('Change thumbnail feature coming soon');
  };

  const handleBoardDetails = () => {
    toast.info('Board details feature coming soon');
  };

  const handleTogglePrivacy = (visibility: BoardVisibilityValue) => {
    updateVisibilityMutate({ boardId: board._id, visibility })
      .then(() => {
        toast.success(dict?.whiteboard.boardCard.visibility.visibilityUpdated);
      })
      .catch(() => {
        toast.error(
          dict?.whiteboard.boardCard.visibility.visibilityUpdateError,
        );
      });
  };

  const handleMoveToTeam = () => {
    // check visibility
    toast.info('Move to team feature coming soon');
  };

  const handleLeaveBoard = () => {
    toast.info('Leave board feature coming soon');
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'ghost'}
                size="sm"
                className="size-8"
                onClick={e => e.preventDefault()}
              >
                <IconDotsVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52"
              onClick={e => e.stopPropagation()}
            >
              {/* Quick Actions Group */}
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleShare}>
                  <IconShare size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.shared" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <IconLink size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.copyLink" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOpenNewTab}>
                  <IconExternalLink size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.openNewTab" />
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Board Actions Group */}
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={toggleFavorite}>
                  {isFavorite ? (
                    <>
                      <IconStarFilled size={16} className="mr-2" />
                      <TranslateText value="whiteboard.boardCard.options.unstarThisBoard" />
                    </>
                  ) : (
                    <>
                      <IconStar size={16} className="mr-2" />
                      <TranslateText value="whiteboard.boardCard.options.starThisBoard" />
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRename}>
                  <IconEdit size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.renameBoard" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <IconCopy size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.duplicateBoard" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleChangeThumbnail}>
                  <IconPhoto size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.changeThumbnail" />
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Settings Group */}
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleBoardDetails}>
                  <IconInfoCircle size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.boardDetails" />
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconShare size={16} className="mr-2" />
                    <TranslateText value="whiteboard.boardCard.visibility.title" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => handleTogglePrivacy('public')}
                      >
                        <IconWorld size={14} className="mr-1" />
                        <TranslateText value="whiteboard.boardCard.visibility.public" />

                        {board.visibility === 'public' && (
                          <IconCheck
                            size={14}
                            className="ml-auto text-primary"
                          />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTogglePrivacy('organization')}
                      >
                        <IconUsersGroup size={14} className="mr-1" />
                        <TranslateText value="whiteboard.boardCard.visibility.organization" />
                        {board.visibility === 'organization' && (
                          <IconCheck
                            size={14}
                            className="ml-auto text-primary"
                          />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTogglePrivacy('private')}
                      >
                        <IconLock size={14} className="mr-1" />
                        <TranslateText value="whiteboard.boardCard.visibility.private" />
                        {board.visibility === 'private' && (
                          <IconCheck
                            size={14}
                            className="ml-auto text-primary"
                          />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                {board.isOwner && (
                  <DropdownMenuItem onClick={handleMoveToTeam}>
                    <IconUsersGroup size={16} className="mr-2" />
                    <TranslateText value="whiteboard.boardCard.options.moveToTeam" />
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Danger Zone */}
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLeaveBoard}>
                  <IconLogout size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.leaveBoard" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <IconTrash size={16} className="mr-2 text-red-600" />
                  <TranslateText value="whiteboard.boardCard.options.deleteBoard" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
