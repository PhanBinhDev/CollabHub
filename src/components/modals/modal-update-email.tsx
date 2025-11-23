'use client';

import { setPrimaryEmail } from '@/app/actions/account';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import { useReverification, useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ConfirmDialog } from './confirm';

export function ModalUpdateEmail() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { dict } = useClientDictionary();
  const { user } = useUser();

  const performDelete = useReverification(setPrimaryEmail);

  const emailId = getModalData('UPDATE_EMAIL')?.emailId as string;

  console.log('Email ID to set primary:', emailId);

  const handleConfirm = async () => {
    const result = await performDelete(emailId);

    if (!result) {
      toast.info(dict?.settings.account.emails.cancelSetPrimary);
      return;
    }

    if (result.success) {
      toast.success(dict?.settings.account.emails.setPrimarySuccess);
      user?.reload();
      closeModal('UPDATE_EMAIL');
    } else {
      toast.error(dict?.settings.account.emails.setPrimaryError);
    }
  };

  return (
    <ConfirmDialog
      open={isModalOpen('UPDATE_EMAIL')}
      onOpenChange={() => closeModal('UPDATE_EMAIL')}
      onConfirm={handleConfirm}
      title="settings.account.emails.setPrimaryTitle"
      description="settings.account.emails.setPrimaryDescription"
      confirmText="settings.account.emails.setPrimaryButton"
      variant="destructive"
    />
  );
}
