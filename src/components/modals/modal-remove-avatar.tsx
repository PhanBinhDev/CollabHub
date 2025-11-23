'use client';

import { api } from '@/convex/_generated/api';
import useModal from '@/hooks/use-modal';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { ConfirmDialog } from './confirm';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';

export function ModalRemoveAvatar() {
  const { isModalOpen, closeModal } = useModal();
  const { dict } = useClientDictionary();
  const deleteProfileImage = useMutation(api.storage.deleteProfileImage);

  const handleConfirm = async () => {
    try {
      await deleteProfileImage();
      toast.success(dict?.settings.account.profile.removeImageSuccess);
      closeModal('REMOVE_AVATAR');
    } catch (error) {
      toast.error(dict?.settings.account.profile.removeImageError);
      console.error(error);
    }
  };

  return (
    <ConfirmDialog
      open={isModalOpen('REMOVE_AVATAR')}
      onOpenChange={() => closeModal('REMOVE_AVATAR')}
      onConfirm={handleConfirm}
      title="settings.account.profile.removeImageTitle"
      description="settings.account.profile.removeImageDesc"
      confirmText="settings.account.profile.removeImage"
      variant="destructive"
    />
  );
}
