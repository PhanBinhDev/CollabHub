import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const pendingSessions = defineTable({
  clerkUserId: v.string(),
  sessionId: v.string(),
  action: v.union(v.literal('revoke'), v.literal('revoke_all')),
  status: v.union(v.literal('pending'), v.literal('completed')),
  createdAt: v.number(),
})
  .index('by_clerk_user', ['clerkUserId'])
  .index('by_session', ['sessionId']);

import { internalMutation, mutation, query } from './_generated/server';

export const addPendingRevoke = mutation({
  args: {
    clerkUserId: v.string(),
    sessionId: v.string(),
    action: v.union(v.literal('revoke'), v.literal('revoke_all')),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('pendingSessions', {
      clerkUserId: args.clerkUserId,
      sessionId: args.sessionId,
      action: args.action,
      status: 'pending',
      createdAt: Date.now(),
    });
  },
});

export const getPendingSessions = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('pendingSessions')
      .withIndex('by_clerk_user', q => q.eq('clerkUserId', args.clerkUserId))
      .filter(q => q.eq(q.field('status'), 'pending'))
      .collect();
  },
});

export const markSessionRevoked = internalMutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const pending = await ctx.db
      .query('pendingSessions')
      .withIndex('by_session', q => q.eq('sessionId', args.sessionId))
      .first();

    console.log(
      'Marking session as revoked:',
      args.sessionId,
      pending ? 'found pending record' : 'no pending record found',
    );

    if (pending) {
      await ctx.db.patch(pending._id, {
        status: 'completed',
      });
    }
  },
});

export const removePendingRevoke = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const pending = await ctx.db
      .query('pendingSessions')
      .withIndex('by_session', q => q.eq('sessionId', args.sessionId))
      .filter(q => q.eq(q.field('status'), 'pending'))
      .first();

    if (pending) {
      await ctx.db.delete(pending._id);
      console.log('Removed pending session:', args.sessionId);
    }
  },
});

export const removePendingRevokeBatch = mutation({
  args: {
    sessionIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const pending = await ctx.db
      .query('pendingSessions')
      .filter(q => q.eq(q.field('status'), 'pending'))
      .collect();

    const toDelete = pending.filter(p => args.sessionIds.includes(p.sessionId));
    
    await Promise.all(toDelete.map(p => ctx.db.delete(p._id)));
    
    console.log('Removed pending sessions batch:', args.sessionIds.length);
  },
});

// Clean up old completed sessions (older than 1 hour)
export const cleanupCompletedSessions = internalMutation({
  args: {},
  handler: async ctx => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const old = await ctx.db
      .query('pendingSessions')
      .filter(q =>
        q.and(
          q.eq(q.field('status'), 'completed'),
          q.lt(q.field('createdAt'), oneHourAgo),
        ),
      )
      .collect();

    for (const session of old) {
      await ctx.db.delete(session._id);
    }
  },
});
