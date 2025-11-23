import { getAuthUserId } from '@convex-dev/auth/server';
import { defineTable, paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const NotificationType = v.union(
  v.literal('mention'),
  v.literal('comment'),
  v.literal('task_assigned'),
  v.literal('task_completed'),
  v.literal('team_invite'),
  v.literal('workspace_invite'),
  v.literal('message'),
  v.literal('system'),
);

export type NotificationType = typeof NotificationType.type;

export const notificationsTable = defineTable({
  userId: v.id('users'),
  type: NotificationType,
  title: v.string(),
  message: v.string(),
  metadata: v.optional(v.record(v.string(), v.any())),
  actionUrl: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  actorId: v.optional(v.id('users')),
  actorName: v.optional(v.string()),
  actorImageUrl: v.optional(v.string()),
  read: v.boolean(),
  readAt: v.optional(v.number()),
})
  .index('by_user', ['userId'])
  .index('by_user_read', ['userId', 'read']);

export const getUserNotifications = query({
  args: {
    paginationOpts: paginationOptsValidator,
    filter: v.optional(
      v.union(v.literal('all'), v.literal('unread'), v.literal('read')),
    ),
    type: v.optional(NotificationType),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: null };
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) {
      return { page: [], isDone: true, continueCursor: null };
    }

    const filter = args.filter ?? 'all';

    let query;

    if (filter === 'all') {
      query = ctx.db
        .query('notifications')
        .withIndex('by_user', q => q.eq('userId', currentUser._id));
    } else {
      const readValue = filter === 'read';
      query = ctx.db
        .query('notifications')
        .withIndex('by_user_read', q =>
          q.eq('userId', currentUser._id).eq('read', readValue),
        );
    }

    if (args.type) {
      query = query.filter(q => q.eq(q.field('type'), args.type));
    }

    const result = await query.order('desc').paginate(args.paginationOpts);

    const page = result.page.map(notif => ({
      ...notif,
      metadata: notif.metadata ?? null,
    }));

    return {
      ...result,
      page,
    };
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) return 0;

    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_user_read', q =>
        q.eq('userId', currentUser._id).eq('read', false),
      )
      .collect();

    return unread.length;
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) throw new Error('User not found');

    const notification = await ctx.db.get(args.notificationId);

    if (!notification) throw new Error('Notification not found');
    if (notification.userId !== currentUser._id) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.notificationId, {
      read: true,
      readAt: Date.now(),
    });
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) throw new Error('User not found');

    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_read', q =>
        q.eq('userId', currentUser._id).eq('read', false),
      )
      .collect();

    const now = Date.now();
    await Promise.all(
      unreadNotifications.map(notification =>
        ctx.db.patch(notification._id, {
          read: true,
          readAt: now,
        }),
      ),
    );

    return unreadNotifications.length;
  },
});

export const deleteNotification = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) throw new Error('User not found');

    const notification = await ctx.db.get(args.notificationId);

    if (!notification) throw new Error('Notification not found');
    if (notification.userId !== currentUser._id) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.notificationId);
  },
});

// export const createNotification = internalMutation({
//   args: {
//     userId: v.id('users'),
//     type: NotificationType,
//     title: v.string(),
//     message: v.string(),
//     actionUrl: v.optional(v.string()),
//     imageUrl: v.optional(v.string()),
//     actorId: v.optional(v.id('users')),
//   },
//   handler: async (ctx, args) => {
//     // Fetch actor details and denormalize (store directly in notification)
//     let actorName: string | undefined;
//     let actorImageUrl: string | undefined;

//     if (args.actorId) {
//       const actor = await ctx.db.get(args.actorId);
//       if (actor) {
//         actorName = actor.name;
//         actorImageUrl = actor.imageUrl;
//       }
//     }

//     await ctx.db.insert('notifications', {
//       userId: args.userId,
//       type: args.type,
//       title: args.title,
//       message: args.message,
//       actionUrl: args.actionUrl,
//       imageUrl: args.imageUrl,
//       actorId: args.actorId,
//       actorName, // Denormalized - no need to join later
//       actorImageUrl, // Denormalized - no need to join later
//       read: false,
//       createdAt: Date.now(),
//     });
//   },
// });

// Bulk create notifications (for team/workspace invites)
// export const createBulkNotifications = internalMutation({
//   args: {
//     userIds: v.array(v.id('users')),
//     type: NotificationType,
//     title: v.string(),
//     message: v.string(),
//     actionUrl: v.optional(v.string()),
//     imageUrl: v.optional(v.string()),
//     actorId: v.optional(v.id('users')),
//   },
//   handler: async (ctx, args) => {
//     const { userIds, ...notificationData } = args;

//     // Fetch actor once, reuse for all notifications
//     let actorName: string | undefined;
//     let actorImageUrl: string | undefined;

//     if (args.actorId) {
//       const actor = await ctx.db.get(args.actorId);
//       if (actor) {
//         actorName = actor.name;
//         actorImageUrl = actor.imageUrl;
//       }
//     }

//     await Promise.all(
//       userIds.map(userId =>
//         ctx.db.insert('notifications', {
//           userId,
//           ...notificationData,
//           actorName,
//           actorImageUrl,
//           read: false,
//           createdAt: Date.now(),
//         }),
//       ),
//     );
//   },
// });
