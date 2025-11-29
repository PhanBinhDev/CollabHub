'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { DictKey } from '@/features/internationalization/get-dictionaries';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';
import { ViewType } from '@/types';
import { useOrganization } from '@clerk/nextjs';
import {
  IconGridDots,
  IconList,
  IconPlus,
  TablerIcon,
} from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

interface HeaderBoardListProps {
  view?: ViewType;
  setView?: Dispatch<SetStateAction<ViewType>>;
  showFilter?: boolean;
}

const viewOptions: {
  type: ViewType;
  icon: TablerIcon;
  label: DictKey;
}[] = [
  { type: 'GRID', icon: IconGridDots, label: 'common.view.grid' },
  { type: 'LIST', icon: IconList, label: 'common.view.list' },
];

export const HeaderBoardList = ({
  view,
  setView,
  showFilter,
}: HeaderBoardListProps) => {
  const { mutate, pending } = useApiMutation(api.boards.create);
  const { organization } = useOrganization();
  const { dict } = useClientDictionary();

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
    <div className={cn('flex flex-col w-full p-3', showFilter && 'gap-3')}>
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
        {/* Left: filter */}

        {/* Right: set view */}
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
              <TooltipContent>
                <TranslateText value={opt.label} />
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};
