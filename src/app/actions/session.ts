'use server';

import { api } from '@/convex/_generated/api';
import { auth, clerkClient, reverificationError, Session } from '@clerk/nextjs/server';
import { fetchMutation } from 'convex/nextjs';

export async function revokeSession(sessionId: string) {
  const { has, userId } = await auth.protect();

  const shouldUserRevalidate = !has({ reverification: 'strict' });

  if (shouldUserRevalidate) {
    return reverificationError('strict');
  }

  try {
    await fetchMutation(api.sessions.addPendingRevoke, {
      clerkUserId: userId,
      sessionId,
      action: 'revoke',
    });

    const client = await clerkClient();
    await client.sessions.revokeSession(sessionId);

    return { success: true };
  } catch (error) {
    console.error('Revoke session error:', error);

    // Rollback: Remove from pending sessions
    try {
      await fetchMutation(api.sessions.removePendingRevoke, {
        sessionId,
      });
    } catch (rollbackError) {
      console.error('Failed to rollback pending session:', rollbackError);
    }

    return { success: false, error: 'Failed to revoke session' };
  }
}

export async function revokeAllOtherSessions(currentSessionId: string) {
  const { userId, has } = await auth.protect();

  const shouldUserRevalidate = !has({ reverification: 'strict' });

  if (shouldUserRevalidate) {
    return reverificationError('strict');
  }

  let otherSessions: Session[] = [];

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userSessions = await client.sessions.getSessionList({
      userId: user.id,
    });

    otherSessions = userSessions.data.filter(
      s => s.id !== currentSessionId,
    );

    await Promise.all(
      otherSessions.map(s =>
        fetchMutation(api.sessions.addPendingRevoke, {
          clerkUserId: userId,
          sessionId: s.id,
          action: 'revoke_all',
        }),
      ),
    );

    await Promise.all(
      otherSessions.map(s => client.sessions.revokeSession(s.id)),
    );

    return { success: true };
  } catch (error) {
    console.error('Revoke all sessions error:', error);

    try {
      const sessionIds = otherSessions.map(s => s.id);
      await fetchMutation(api.sessions.removePendingRevokeBatch, {
        sessionIds,
      });
    } catch (rollbackError) {
      console.error('Failed to rollback pending sessions:', rollbackError);
    }

    return { success: false, error: 'Failed to revoke sessions' };
  }
}
