'use client';

import { useClientDictionary } from '@/features/internationalization/dictionary-provider';
import { Canvas } from '@/features/whiteboard/components/canvas';
import { Room } from '@/features/whiteboard/components/room';
import { LiveblocksProvider } from '@liveblocks/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface BoardClientPageProps {
  boardId: string;
}

const BoardClientPage = ({ boardId }: BoardClientPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict } = useClientDictionary();
  const sharedId = searchParams.get('shareId');

  return (
    <LiveblocksProvider
      authEndpoint={async room => {
        const response = await fetch('/api/liveblocks-auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ room, shareId: sharedId }),
        });

        if (response.status === 401) {
          const data = await response.json();

          toast.error(dict?.whiteboard.signInToAccessBoard);
          router.push(data.redirectUrl);

          throw new Error('Unauthorized');
        }

        if (response.status === 403) {
          console.log('forbidden');

          toast.error(dict?.whiteboard.accessDenied);
          router.push('/dashboard');

          throw new Error('Forbidden');
        }

        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }

        return await response.json();
      }}
      throttle={16}
    >
      <Room roomId={boardId} fallback={null}>
        <Canvas boardId={boardId} />
      </Room>
    </LiveblocksProvider>
  );
};

export default BoardClientPage;
