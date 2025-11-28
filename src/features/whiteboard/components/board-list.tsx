import Spinner from '@/components/shared/spinner';
import { ViewType } from '@/types';
import { useState } from 'react';
import EmptyBoard from './empty-board';
import { HeaderBoardList } from './header-board-list';

interface BoardListProps {
  orgId: string | undefined;
}

const BoardList = ({}: BoardListProps) => {
  const [view, setView] = useState<ViewType>('GRID');
  const data = [];
  const loading = true;

  return (
    <div className="flex flex-col gap-4 h-full">
      <HeaderBoardList onCreate={() => {}} view={view} setView={setView} />

      <div className="flex flex-col gap-4 flex-1 overflow-auto items-center justify-center">
        {loading ? (
          <Spinner size={32} />
        ) : data.length === 0 ? (
          <EmptyBoard />
        ) : (
          data.map(board => (
            <div key={board.id} className="p-4 border rounded-md">
              {board.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BoardList;
