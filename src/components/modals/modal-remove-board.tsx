'use client';

import { api } from '@/convex/_generated/api';
import { Board } from '@/convex/boards';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { useApiMutation } from '@/hooks/use-api-mutation';
import useModal from '@/hooks/use-modal';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ConfirmDialog } from './confirm';

export function ModalRemoveBoard() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { dict } = useClientDictionary();
  const router = useRouter();
  const { mutate: deleteBoardMutate, pending } = useApiMutation(
    api.boards.deleteBoard,
  );

  const { board } = getModalData('REMOVE_BOARD') as {
    board: Board;
  };

  const handleConfirm = async () => {
    deleteBoardMutate({ boardId: board._id })
      .then(() => {
        toast.success(dict?.whiteboard.boardCard.removeBoard.deleteSuccess);
        closeModal('REMOVE_BOARD');
        router.push('/dashboard');
      })
      .catch(() => {
        toast.error(dict?.whiteboard.boardCard.removeBoard.deleteError);
      });
  };

  return (
    <ConfirmDialog
      open={isModalOpen('REMOVE_BOARD')}
      onOpenChange={() => closeModal('REMOVE_BOARD')}
      onConfirm={handleConfirm}
      title="whiteboard.boardCard.removeBoard.title"
      description="whiteboard.boardCard.removeBoard.desc"
      confirmText="whiteboard.boardCard.removeBoard.confirmText"
      variant="destructive"
      loading={pending}
    />
  );
}
