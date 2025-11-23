import { DictKey } from '@/features/internationalization/get-dictionaries';
import { TablerIcon } from '@tabler/icons-react';

export type NavItem = {
  name: string;
  href: string;
  icon: TablerIcon;
  translationKey: DictKey;
  badge?: number;
  exactMatch?: boolean;
};

export type ModalType =
  | 'REMOVE_AVATAR'
  | 'REMOVE_ACCOUNT'
  | 'CREATE_WORKSPACE'
  | 'EDIT_WORKSPACE'
  | 'DELETE_WORKSPACE'
  | 'INVITE_MEMBER'
  | 'REMOVE_MEMBER'
  | 'ADD_EMAIL'
  | 'REMOVE_EMAIL'
  | 'UPDATE_EMAIL';
