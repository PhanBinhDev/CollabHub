'use client';

import { Canvas } from '@/features/whiteboard/components/canvas';
import { Room } from '@/features/whiteboard/components/room';
import { LiveblocksProvider } from '@liveblocks/react';

interface BoardClientPageProps {
  boardId: string;
}

const BoardClientPage = ({ boardId }: BoardClientPageProps) => {
  return (
    <LiveblocksProvider authEndpoint={`/api/liveblocks-auth`}>
      <Room roomId={boardId} fallback={null}>
        <Canvas boardId={boardId} />
      </Room>
    </LiveblocksProvider>
  );
};

export default BoardClientPage;
