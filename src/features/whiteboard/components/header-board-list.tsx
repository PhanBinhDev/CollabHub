'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { FilterOption, SortOption, ViewOption, ViewType } from '@/types';
import { useOrganization } from '@clerk/nextjs';
import { IconGridDots, IconList, IconPlus } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

interface HeaderBoardListProps {
  view?: ViewType;
  setView?: Dispatch<SetStateAction<ViewType>>;
}

const viewOptions: ViewOption[] = [
  { type: 'GRID', icon: IconGridDots, label: 'common.view.grid' },
  { type: 'LIST', icon: IconList, label: 'common.view.list' },
];

const filterOptions: FilterOption[] = [
  { label: 'whiteboard.filter.ownerByAnyone', value: 'anyone' },
  { label: 'whiteboard.filter.ownerByMe', value: 'ownerByMe' },
  { label: 'whiteboard.filter.notOwnerByMe', value: 'notOwnerByMe' },
  { label: 'whiteboard.filter.starredBoards', value: 'starred' },
  { label: 'whiteboard.filter.sharedBoards', value: 'shared' },
];

const sortOptions: SortOption[] = [
  { label: 'whiteboard.sort.lastModified', value: 'lastModified' },
  { label: 'whiteboard.sort.lastOpened', value: 'lastOpened' },
  { label: 'whiteboard.sort.createdAt', value: 'createdAt' },
  { label: 'whiteboard.sort.nameAsc', value: 'nameAsc' },
  { label: 'whiteboard.sort.nameDesc', value: 'nameDesc' },
];

export const HeaderBoardList = ({ view, setView }: HeaderBoardListProps) => {
  const { mutate, pending } = useApiMutation(api.boards.create);
  const { organization } = useOrganization();
  const { dict } = useClientDictionary();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = useMemo(
    () => qs.parse(searchParams.toString()),
    [searchParams],
  );

  const filterValue = (currentQuery.filter as string) || filterOptions[0].value;
  const sortValue = (currentQuery.sort as string) || sortOptions[0].value;

  const updateQueryParams = useCallback(
    (updates: Record<string, string>) => {
      const newQuery = qs.stringify(
        { ...currentQuery, ...updates },
        { skipNull: true, skipEmptyString: true },
      );
      router.replace(`${window.location.pathname}?${newQuery}`, {
        scroll: false,
      });
    },
    [currentQuery, router],
  );

  const handleFilterChange = useCallback(
    (value: string) => {
      updateQueryParams({ filter: value });
    },
    [updateQueryParams],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      updateQueryParams({ sort: value });
    },
    [updateQueryParams],
  );

  const onClick = () => {
    if (!organization) return;

    mutate({ title: 'New Board', orgId: organization?.id })
      .then(() => {
        toast.success(dict?.whiteboard.boardCreatedSuccessfully);
        // redirect to the newly created board can be handled here
      })
      .catch(() => {
        toast.error(dict?.whiteboard.boardCreationFailed);
      });
  };

  return (
    <div className="flex flex-col w-full p-3 gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          <TranslateText value="whiteboard.title" />
        </h2>

        <Button onClick={onClick} disabled={pending} loading={pending}>
          {!pending && <IconPlus className="mr-1" />}
          <TranslateText value="whiteboard.createBoard" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2" role="group">
          <h3 className="text-sm font-medium">
            <TranslateText value="common.filter.filterBy" />
          </h3>
          <Select onValueChange={handleFilterChange} value={filterValue}>
            <SelectTrigger className="w-[180px] outline-none">
              <SelectValue
                placeholder={<TranslateText value="whiteboard.filter.title" />}
              />
            </SelectTrigger>
            <SelectContent align="end">
              {filterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <TranslateText value={option.label} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h3 className="text-sm font-medium">
            <TranslateText value="common.sort.sortBy" />
          </h3>
          <Select onValueChange={handleSortChange} value={sortValue}>
            <SelectTrigger className="w-[140px] outline-none">
              <SelectValue
                placeholder={<TranslateText value="whiteboard.sort.title" />}
              />
            </SelectTrigger>
            <SelectContent align="end">
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <TranslateText value={option.label} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {viewOptions.map(opt => (
            <Tooltip key={opt.type}>
              <TooltipTrigger asChild>
                <Button
                  key={opt.type}
                  variant={view === opt.type ? 'outline' : 'ghost'}
                  size="icon"
                  onClick={() => setView?.(opt.type)}
                  aria-label={opt.label}
                >
                  <opt.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <TranslateText value={opt.label} />
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};
