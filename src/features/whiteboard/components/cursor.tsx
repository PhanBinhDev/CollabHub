'use client';

import { DEFAULT_NAME_TEAMMATE } from '@/constants/app';
import { getUserColor } from '@/lib/utils';
import { useOther } from '@liveblocks/react/suspense';
import { IconPointer } from '@tabler/icons-react';
import { memo } from 'react';

interface CursorProps {
  connectionId: number;
}

const Cursor = ({ connectionId }: CursorProps) => {
  const info = useOther(connectionId, user => user.info);
  const cursor = useOther(connectionId, user => user.presence?.cursor);

  const name = info?.name || DEFAULT_NAME_TEAMMATE;

  if (!cursor) return null;

  const { x, y } = cursor;

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      height={50}
      width={name.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <IconPointer
        className="w-5 h-5"
        style={{
          fill: getUserColor(connectionId),
          color: getUserColor(connectionId),
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs font-medium text-white"
        style={{
          background: getUserColor(connectionId),
        }}
      >
        {name}
      </div>
    </foreignObject>
  );
};

Cursor.displayName = 'Cursor';

export default memo(Cursor);
