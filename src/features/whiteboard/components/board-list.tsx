import Spinner from '@/components/shared/spinner';
import TranslateText from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import { LOCAL_STORAGE_KEY } from '@/constants/key';
import { api } from '@/convex/_generated/api';
import {
  BoardWithMetadata,
  FilterBoardValue,
  SortBoardValue,
} from '@/convex/boards';
import { ViewType } from '@/types';
import { useQuery } from 'convex/react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import BoardCard from './board-card';
import EmptyBoard from './empty-board';
import { HeaderBoardList } from './header-board-list';

interface BoardListProps {
  orgId: string;
}

const BoardList = ({ orgId }: BoardListProps) => {
  const [view, setView] = useLocalStorage<ViewType>(
    LOCAL_STORAGE_KEY.BOARD_VIEW_MODE,
    'GRID',
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParams = useMemo(() => {
    return qs.parse(searchParams.toString());
  }, [searchParams]);

  const filter = (queryParams.filter as FilterBoardValue) || 'anyone';
  const sort = (queryParams.sort as SortBoardValue) || 'lastModified';

  const data = useQuery(api.boards.get, { orgId, filter, sort });

  const hasActiveFilters = filter !== 'anyone' || sort !== 'lastModified';

  const reset = () => {
    router.replace('/dashboard/whiteboard');
  };

  const renderEmpty = () => {
    if (data === undefined) {
      return (
        <div className="flex justify-center items-center flex-1">
          <Spinner size={32} />
        </div>
      );
    }

    if (data.length === 0) {
      if (hasActiveFilters) {
        return (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                <TranslateText value="whiteboard.empty.noResultTitle" />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <TranslateText value="whiteboard.empty.noResultDesc" />
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <TranslateText value="whiteboard.empty.tryChangeFilter" />
              </p>
            </div>
            <Button onClick={reset} variant={'outline'}>
              <TranslateText value="whiteboard.empty.clearFilters" />
            </Button>
          </div>
        );
      }

      return <EmptyBoard />;
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <HeaderBoardList view={view} setView={setView} />

      {renderEmpty()}

      {data && data.length > 0 && view === 'GRID' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 pb-10 px-3">
          {data.map(board => (
            <BoardCard
              board={board as BoardWithMetadata}
              isFavorite={board.isFavorite}
              key={board._id}
            />
          ))}
        </div>
      )}

      {data && data.length > 0 && view === 'LIST' && (
        <div className="flex flex-col gap-4 pb-10 px-3">
          {data.map(board => (
            <BoardCard
              board={board as BoardWithMetadata}
              isFavorite={board.isFavorite}
              key={board._id}
              view="LIST"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;
