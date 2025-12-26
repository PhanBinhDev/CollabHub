/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { setPrimaryEmail } from '@/app/actions/account';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import useModal from '@/hooks/use-modal';
import { useReverification, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from './confirm';

export function ModalUpdateEmail() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { dict } = useClientDictionary();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const performUpdate = useReverification(setPrimaryEmail);

  const emailId = getModalData('UPDATE_EMAIL')?.emailId as string;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const result = await performUpdate(emailId);

      if (!result) {
        toast.info(dict?.settings.account.emails.cancelSetPrimary);
        setIsLoading(false);
        return;
      }

      if (result.success) {
        toast.success(dict?.settings.account.emails.setPrimarySuccess);
        user?.reload();
        closeModal('UPDATE_EMAIL');
      }
    } catch (error) {
      console.log('Error in updating primary email:', error);
      toast.error(dict?.settings.account.emails.setPrimaryError);
    } finally {
      setIsLoading(false);
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
      loading={isLoading}
    />
  );
}
