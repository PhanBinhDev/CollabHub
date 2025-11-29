import Spinner from '@/components/shared/spinner';
import { api } from '@/convex/_generated/api';
import { ViewType } from '@/types';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import BoardCard from './board-card';
import EmptyBoard from './empty-board';
import { HeaderBoardList } from './header-board-list';

interface BoardListProps {
  orgId: string;
}

const BoardList = ({ orgId }: BoardListProps) => {
  const [view, setView] = useState<ViewType>('GRID');

  const data = useQuery(api.boards.get, { orgId });

  return (
    <div className="flex flex-col gap-4 h-full">
      <HeaderBoardList
        view={view}
        setView={setView}
        showFilter={data && data.length > 0}
      />

      <div className="flex flex-col gap-4 overflow-auto items-center justify-center p-3">
        {data === undefined ? (
          <Spinner size={32} />
        ) : data.length === 0 ? (
          <EmptyBoard />
        ) : (
          null
        )}
      </div>
      {data && data.length > 0 && view === 'GRID' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 pb-10">
          {data.map(board => (
            <BoardCard board={board} key={board._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;
