'use client';

import { useOthersConnectionIds } from '@liveblocks/react';
import { memo } from 'react';
import Cursor from './cursor';

const Cussors = () => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map(id => (
        <Cursor key={id} connectionId={id} />
      ))}
    </>
  );
};

const CursorsPresence = () => {
  return (
    <>
      {/* TODO: Draft pencil */}
      <Cussors />
    </>
  );
};

CursorsPresence.displayName = 'CursorsPresence';

export default memo(CursorsPresence);
