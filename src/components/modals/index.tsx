'use client';

import useModal from '@/hooks/use-modal';
import { useEffect, useState } from 'react';
import { ModalAddEmail } from './modal-add-email';
import { ModalAddOrg } from './modal-add-org';
import { ModalRemoveAccount } from './modal-remove-account';
import { ModalRemoveAvatar } from './modal-remove-avatar';
import { ModalRemoveBoard } from './modal-remove-board';
import { ModalRemoveEmail } from './modal-remove-email';
import { ModalUpdateEmail } from './modal-update-email';
import { ModalUpdateNameBoard } from './modal-update-name-board';
import { ModalViewOrg } from './modal-view-org';

const Modals = () => {
  const { isModalOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {isModalOpen('REMOVE_AVATAR') && <ModalRemoveAvatar />}
      {isModalOpen('REMOVE_ACCOUNT') && <ModalRemoveAccount />}
      {isModalOpen('ADD_EMAIL') && <ModalAddEmail />}
      {isModalOpen('REMOVE_EMAIL') && <ModalRemoveEmail />}
      {isModalOpen('UPDATE_EMAIL') && <ModalUpdateEmail />}
      {isModalOpen('ADD_ORG') && <ModalAddOrg />}
      {isModalOpen('VIEW_ORG') && <ModalViewOrg />}
      {isModalOpen('REMOVE_BOARD') && <ModalRemoveBoard />}
      {isModalOpen('UPDATE_NAME_BOARD') && <ModalUpdateNameBoard />}
    </>
  );
};

export default Modals;
