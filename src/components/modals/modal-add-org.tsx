'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import useModal from '@/hooks/use-modal';
import { CreateOrganization } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export const ModalAddOrg = () => {
  const { closeModal, isModalOpen } = useModal();

  const handleClose = () => {
    closeModal('ADD_ORG');
  };

  const pathname = usePathname();

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen('ADD_ORG')}>
      <DialogContent
        className="p-0 bg-transparent! border-none max-w-[434px]! outline-none! ring-0!"
        showCloseButton={false}
      >
        <DialogTitle className="hidden" />
        <CreateOrganization afterCreateOrganizationUrl={pathname} />
        <DialogDescription id="add-org-desc" className="sr-only">
          Create a new organization dialog
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
