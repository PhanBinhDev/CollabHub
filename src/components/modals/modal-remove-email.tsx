'use client';

import { removeEmail } from '@/app/actions/account';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import { useReverification, useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ConfirmDialog } from './confirm';

export function ModalRemoveEmail() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { dict } = useClientDictionary();
  const { user } = useUser();

  const performDelete = useReverification(removeEmail);

  const emailId = getModalData('REMOVE_EMAIL')?.emailId as string;

  const handleConfirm = async () => {
    const result = await performDelete(emailId);

    if (!result) {
      toast.info(dict?.settings.account.emails.cancelDeleteEmail);
      return;
    }

    if (result.success) {
      toast.success(dict?.settings.account.emails.removeEmailSuccess);
      user?.reload();
      closeModal('REMOVE_EMAIL');
    } else {
      toast.error(dict?.settings.account.emails.removeEmailError);
    }
  };

  return (
    <ConfirmDialog
      open={isModalOpen('REMOVE_EMAIL')}
      onOpenChange={() => closeModal('REMOVE_EMAIL')}
      onConfirm={handleConfirm}
      title="settings.account.emails.deleteEmailTitle"
      description="settings.account.emails.deleteEmailWarning"
      confirmText="settings.account.emails.deleteEmailButton"
      variant="destructive"
    />
  );
}
