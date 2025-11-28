'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import useModal from '@/hooks/use-modal';
import { OrganizationProfile } from '@clerk/nextjs';

export const ModalViewOrg = () => {
  const { closeModal, isModalOpen } = useModal();

  const handleClose = () => {
    closeModal('VIEW_ORG');
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen('VIEW_ORG')}>
      <DialogContent
        className="p-0 bg-transparent! border-none max-w-3xl! outline-none! ring-0!"
        showCloseButton={false}
      >
        <DialogTitle className="hidden" />
        <OrganizationProfile />
        <DialogDescription id="view-org-desc" className="sr-only">
          View an existing organization dialog
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
