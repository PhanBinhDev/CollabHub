'use server';

import { ensureEnvironmentVariable } from '@/convex/http';
import { Liveblocks } from '@liveblocks/node';

const secret = ensureEnvironmentVariable(
  'NEXT_PUBLIC_LIVE_BLOCK_SECRET_API_KEY',
);

const liveblocks = new Liveblocks({
  secret,
});

export async function prewarmRoom(roomId: string) {
  await liveblocks.prewarmRoom(roomId);
}
