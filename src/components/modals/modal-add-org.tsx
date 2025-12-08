'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import useModal from '@/hooks/use-modal';
import { cn } from '@/lib/utils';
import { CreateOrganization } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export const ModalAddOrg = () => {
  const { closeModal, isModalOpen, getModalData } = useModal();

  const handleClose = () => {
    closeModal('ADD_ORG');
  };

  const { disableClose } = getModalData('ADD_ORG') as {
    disableClose?: boolean;
  };

  const pathname = usePathname();

  return (
    <Dialog
      onOpenChange={disableClose ? undefined : handleClose}
      open={isModalOpen('ADD_ORG')}
    >
      <DialogOverlay
        className={cn(
          disableClose && 'backdrop-brightness-50 backdrop-saturate-150',
        )}
      ></DialogOverlay>
      <DialogContent
        className={cn(
          'p-0 bg-transparent! border-none max-w-[434px]! outline-none! ring-0!',
          disableClose && 'backdrop-brightness-50 backdrop-saturate-150',
        )}
        showCloseButton={false}
      >
        <DialogTitle className="hidden" />
        <CreateOrganization
          afterCreateOrganizationUrl={pathname}
          skipInvitationScreen
        />
        <DialogDescription id="add-org-desc" className="sr-only">
          Create a new organization dialog
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
