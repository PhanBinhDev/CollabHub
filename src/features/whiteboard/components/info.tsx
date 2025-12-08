'use client';

import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import useModal from '@/hooks/use-modal';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import BoardCardAction from './board-card-action';

const font = Poppins({ subsets: ['latin'], weight: ['600'] });

interface InfoProps {
  boardId: string;
}

const Info = ({ boardId }: InfoProps) => {
  const { openModal } = useModal();
  const data = useQuery(api.boards.getDetails, { id: boardId as Id<'boards'> });

  if (!data) {
    return <Info.Skeleton />;
  }

  const canRename = data.isOwner || data.userRole === 'editor';

  return (
    <div className="absolute top-2 left-2 py-2 bg-white rounded-md px-1.5 h-12 flex gap-2 items-center shadow-md">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="px-2" variant={'board'} asChild>
            <Link href={`/dashboard/whiteboard`}>
              <Image
                src={'/logo.png'}
                alt="Logo"
                width={26}
                height={26}
                className="rounded-md"
              />
              <span
                className={cn(
                  'font-semibold text-sl ml-1 text-black',
                  font.className,
                )}
              >
                <TranslateText value="app.name" />
              </span>
            </Link>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <TranslateText value="whiteboard.info.goToDashboard" />
        </TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="py-2" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'board'}
            className="text-base font-normal px-2"
            disabled={!canRename}
            onClick={() => openModal('UPDATE_NAME_BOARD', { board: data })}
          >
            {data.title}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <TranslateText value="whiteboard.info.editBoardName" />
        </TooltipContent>
      </Tooltip>

      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <BoardCardAction board={data} isFavorite={data.isFavorite} />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <TranslateText value="whiteboard.info.editBoardName" />
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="w-[300px] absolute top-2 px-1.5 left-2 bg-white rounded-md h-12 flex items-center shadow-md" />
  );
};

export default Info;
