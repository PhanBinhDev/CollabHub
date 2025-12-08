import { prewarmRoom } from '@/app/actions/room';
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
import { api } from '@/convex/_generated/api';
import { BoardVisibilityValue, BoardWithMetadata } from '@/convex/boards';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { useApiMutation } from '@/hooks/use-api-mutation';
import useModal from '@/hooks/use-modal';
import {
  IconCheck,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
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
import { useMemo } from 'react';
import { toast } from 'sonner';

interface BoardCardActionProps {
  board: BoardWithMetadata;
  isFavorite: boolean;
  children?: React.ReactNode;
}

const BoardCardAction = ({
  board,
  isFavorite,
  children,
}: BoardCardActionProps) => {
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
    const link = `${window.location.origin}/board/${board._id}`;
    navigator.clipboard.writeText(link);
    toast.success(dict?.whiteboard.boardCard.linkCopied);
  };

  const handleOpenNewTab = () => {
    window.open(`/board/${board._id}`, '_blank');
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
    toast.info('Move to team feature coming soon');
  };

  const handleLeaveBoard = () => {
    toast.info('Leave board feature coming soon');
  };

  const permission = useMemo(() => {
    const isOwner = board.isOwner;
    const userRole = board.userRole;
    const canEdit = isOwner || userRole === 'editor';
    const canComment =
      isOwner || userRole === 'editor' || userRole === 'commenter';
    const canDelete = isOwner;
    const canChangeVisibility = isOwner;
    const canShare = isOwner || userRole === 'editor';
    const canRename = isOwner || userRole === 'editor';
    const canDuplicate = true;
    const canChangeThumbnail = isOwner || userRole === 'editor';
    const canMoveToTeam = isOwner;
    const canLeave = !isOwner && board.visibility === 'private';

    return {
      canEdit,
      canComment,
      canDelete,
      canChangeVisibility,
      canShare,
      canRename,
      canDuplicate,
      canChangeThumbnail,
      canMoveToTeam,
      canLeave,
    };
  }, [board]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant={'ghost'}
            size="sm"
            className="size-8"
            onClick={e => e.preventDefault()}
          >
            <IconDotsVertical size={16} />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52"
        onClick={e => e.stopPropagation()}
      >
        {/* Quick Actions Group */}
        <DropdownMenuGroup>
          {permission.canShare && (
            <DropdownMenuItem onClick={handleShare}>
              <IconShare size={16} className="mr-2" />
              <TranslateText value="whiteboard.boardCard.options.shared" />
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleCopyLink}>
            <IconLink size={16} className="mr-2" />
            <TranslateText value="whiteboard.boardCard.options.copyLink" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenNewTab}
            onPointerDown={() => prewarmRoom(board._id)}
          >
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
          {permission.canRename && (
            <DropdownMenuItem onClick={handleRename}>
              <IconEdit size={16} className="mr-2" />
              <TranslateText value="whiteboard.boardCard.options.renameBoard" />
            </DropdownMenuItem>
          )}
          {permission.canDuplicate && (
            <DropdownMenuItem onClick={handleDuplicate}>
              <IconCopy size={16} className="mr-2" />
              <TranslateText value="whiteboard.boardCard.options.duplicateBoard" />
            </DropdownMenuItem>
          )}
          {permission.canChangeThumbnail && (
            <DropdownMenuItem onClick={handleChangeThumbnail}>
              <IconPhoto size={16} className="mr-2" />
              <TranslateText value="whiteboard.boardCard.options.changeThumbnail" />
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Settings Group */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleBoardDetails}>
            <IconInfoCircle size={16} className="mr-2" />
            <TranslateText value="whiteboard.boardCard.options.boardDetails" />
          </DropdownMenuItem>
          {permission.canChangeVisibility && (
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
                      <IconCheck size={14} className="ml-auto text-primary" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTogglePrivacy('organization')}
                  >
                    <IconUsersGroup size={14} className="mr-1" />
                    <TranslateText value="whiteboard.boardCard.visibility.organization" />
                    {board.visibility === 'organization' && (
                      <IconCheck size={14} className="ml-auto text-primary" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTogglePrivacy('private')}
                  >
                    <IconLock size={14} className="mr-1" />
                    <TranslateText value="whiteboard.boardCard.visibility.private" />
                    {board.visibility === 'private' && (
                      <IconCheck size={14} className="ml-auto text-primary" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}
          {permission.canMoveToTeam && (
            <DropdownMenuItem onClick={handleMoveToTeam}>
              <IconUsersGroup size={16} className="mr-2" />
              <TranslateText value="whiteboard.boardCard.options.moveToTeam" />
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        {(permission.canDelete || permission.canLeave) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {permission.canLeave && (
                <DropdownMenuItem onClick={handleLeaveBoard}>
                  <IconLogout size={16} className="mr-2" />
                  <TranslateText value="whiteboard.boardCard.options.leaveBoard" />
                </DropdownMenuItem>
              )}
              {permission.canDelete && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <IconTrash size={16} className="mr-2 text-red-600" />
                  <TranslateText value="whiteboard.boardCard.options.deleteBoard" />
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BoardCardAction;
