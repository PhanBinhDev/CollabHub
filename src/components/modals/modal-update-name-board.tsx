'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { Board } from '@/convex/boards';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { useApiMutation } from '@/hooks/use-api-mutation';
import useModal from '@/hooks/use-modal';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormValues = {
  title: string;
};

export function ModalUpdateNameBoard() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { dict } = useClientDictionary();
  const { mutate: updateTitleMutate, pending } = useApiMutation(
    api.boards.updateTitle,
  );

  const { board } = getModalData('UPDATE_NAME_BOARD') as { board: Board };

  const isUpdateNameModalOpen = isModalOpen('UPDATE_NAME_BOARD');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: { title: board?.title || '' },
  });

  const onSubmit = async (data: FormValues) => {
    updateTitleMutate({ boardId: board._id, newTitle: data.title })
      .then(() => {
        toast.success(dict?.whiteboard.boardCard.update.updateTitleSuccess);
        closeModal('UPDATE_NAME_BOARD');
      })
      .catch(() => {
        toast.error(dict?.whiteboard.boardCard.update.updateTitleError);
      });
  };

  useEffect(() => {
    reset({ title: board?.title || '' });
  }, [board, isUpdateNameModalOpen, reset]);

  return (
    <Dialog
      open={isModalOpen('UPDATE_NAME_BOARD')}
      onOpenChange={() => closeModal('UPDATE_NAME_BOARD')}
    >
      <DialogContent>
        <DialogTitle>
          {dict?.whiteboard.boardCard.update.updateTitleTitle}
        </DialogTitle>
        <DialogDescription>
          {dict?.whiteboard.boardCard.update.updateTitleDesc}
        </DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <Input
            {...register('title', { required: true, minLength: 2 })}
            placeholder={
              dict?.whiteboard.boardCard.update.updateTitlePlaceholder
            }
            disabled={pending}
          />
          {errors.title && (
            <p className="text-sm text-destructive">
              {dict?.whiteboard.boardCard.update.updateTitleErrorRequired}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => closeModal('UPDATE_NAME_BOARD')}
            >
              {dict?.common.cancel}
            </Button>
            <Button type="submit" loading={pending}>
              {dict?.common.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
