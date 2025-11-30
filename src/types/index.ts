import { FilterBoardValue, SortBoardValue } from '@/convex/boards';
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
  | 'ADD_WORKSPACE'
  | 'EDIT_WORKSPACE'
  | 'DELETE_WORKSPACE'
  | 'INVITE_MEMBER'
  | 'REMOVE_MEMBER'
  | 'ADD_EMAIL'
  | 'REMOVE_EMAIL'
  | 'UPDATE_EMAIL'
  | 'ADD_ORG'
  | 'VIEW_ORG'
  | 'REMOVE_BOARD'
  | 'UPDATE_NAME_BOARD'
  | 'UPDATE_THUMBNAIL_BOARD';

export type ViewType = 'GRID' | 'LIST';

export type ViewOption = {
  type: ViewType;
  icon: TablerIcon;
  label: DictKey;
};

export type FilterOption = {
  label: DictKey;
  value: FilterBoardValue;
};

export type SortOption = {
  label: DictKey;
  value: SortBoardValue;
};

export type BoardCardOption = {
  label: DictKey;
  action: () => void;
  icon: TablerIcon;
  disabled?: boolean;
};
