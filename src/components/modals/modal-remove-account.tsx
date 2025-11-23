'use client';

import { deleteAccount } from '@/app/actions/account';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import { useAuth, useReverification } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ConfirmDialog } from './confirm';

export function ModalRemoveAccount() {
  const { isModalOpen, closeModal } = useModal();
  const { signOut } = useAuth();
  const { dict } = useClientDictionary();

  const performDelete = useReverification(deleteAccount);

  const handleConfirm = async () => {
    const result = await performDelete();

    if (!result) {
      toast.info(dict?.settings.account.danger.cancelledVerification);
      return;
    }

    if (result.success) {
      toast.success(dict?.settings.account.danger.deleteSuccess);
      closeModal('REMOVE_ACCOUNT');
      await signOut();
    } else {
      toast.error(dict?.settings.account.danger.deleteError);
    }
  };

  return (
    <ConfirmDialog
      open={isModalOpen('REMOVE_ACCOUNT')}
      onOpenChange={() => closeModal('REMOVE_ACCOUNT')}
      onConfirm={handleConfirm}
      title="settings.account.danger.deleteAccountTitle"
      description="settings.account.danger.deleteAccountWarning"
      confirmText="settings.account.danger.deleteButton"
      variant="destructive"
      requireConfirmation={{
        text: 'delete my account',
        label: 'settings.account.danger.confirmationLabel',
      }}
    />
  );
}
