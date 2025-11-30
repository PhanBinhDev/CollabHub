import { api } from '@/convex/_generated/api';
import { ensureEnvironmentVariable } from '@/convex/http';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';

const secret = ensureEnvironmentVariable(
  'NEXT_PUBLIC_LIVE_BLOCK_SECRET_API_KEY',
);

const url = ensureEnvironmentVariable('NEXT_PUBLIC_CONVEX_URL');
const convex = new ConvexHttpClient(url);

const liveblocks = new Liveblocks({
  secret,
});

export async function POST(request: Request) {
  const authorization = await auth();

  const user = await currentUser();

  if (!authorization || !user) {
    return new Response('Unauthorized', {
      status: 403,
    });
  }

  const { room } = await request.json();
  const board = await convex.query(api.boards.getDetails, {
    id: room,
  });

  if (board?.orgId !== authorization.orgId) {
    return new Response('Unauthorized', {
      status: 403,
    });
  }

  const userInfo = {
    name: user.firstName || 'Teammate',
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, {
    userInfo,
  });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}
