'use client';

import CanvasLoading from '@/components/shared/canvas-loading';
import { useRoom } from '@liveblocks/react';
import { useEffect, useState } from 'react';
import Info from './info';
import Participants from './participants';
import Toolbar from './toolbar';

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const room = useRoom();
  const [status, setStatus] = useState(room.getStatus());

  useEffect(() => {
    const unsubscribe = room.subscribe('status', setStatus);
    return () => unsubscribe();
  }, [room]);

  const isLoading = status !== 'connected';

  if (isLoading) {
    return <CanvasLoading />;
  }

  return (
    <main className="h-full w-full bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar />
    </main>
  );
};
