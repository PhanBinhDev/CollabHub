'use client';

import { Layer } from '@/types/canvas';
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

interface RoomProps extends IChildren {
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
}

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: [],
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>([]),
        layerIds: new LiveList([]),
      }}
    >
      <ClientSideSuspense fallback={fallback}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
};
