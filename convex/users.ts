/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthUserId } from '@convex-dev/auth/server';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';

export const UserStatus = v.union(
  v.literal('active'),
  v.literal('away'),
  v.literal('busy'),
  v.literal('offline'),
);

export const users = defineTable({
  clerkId: v.string(),
  email: v.string(),
  username: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  imageUrl: v.optional(v.string()),
  imageStorageId: v.optional(v.id('_storage')),
  bio: v.optional(v.string()),
  phone: v.optional(v.string()),
  status: v.optional(UserStatus),
  statusMessage: v.optional(v.string()),
}).index('by_clerk_id', ['clerkId']);

export const userSettings = defineTable({
  userId: v.id('users'),
  emailNotifications: v.object({
    newWorkspace: v.boolean(),
    invitation: v.boolean(),
    taskAssigned: v.boolean(),
    comments: v.boolean(),
    weeklySummary: v.boolean(),
  }),
  pushNotifications: v.object({
    messages: v.boolean(),
    taskUpdates: v.boolean(),
    mentions: v.boolean(),
    reminders: v.boolean(),
  }),
  inAppNotifications: v.object({
    enableAll: v.boolean(),
  }),
  completedOnboarding: v.boolean(),
  language: v.string(),
  timezone: v.string(),
  dateFormat: v.string(),
  timeFormat: v.string(),
}).index('by_user', ['userId']);

export const currentUser = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    return user;
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', data.id))
      .first();

    const primaryEmail = data.email_addresses?.find(
      (e: any) => e.id === data.primary_email_address_id,
    );

    const userData = {
      clerkId: data.id,
      email: primaryEmail?.email_address ?? '',
      username: data.username ?? '',
      firstName: data.first_name ?? '',
      lastName: data.last_name ?? '',
      imageUrl: data.image_url,
    };

    if (existingUser) {
      await ctx.db.patch(existingUser._id, userData);
    } else {
      const newUserId = await ctx.db.insert('users', userData);

      await ctx.db.insert('userSettings', {
        userId: newUserId,
        emailNotifications: {
          newWorkspace: true,
          invitation: true,
          taskAssigned: true,
          comments: false,
          weeklySummary: true,
        },
        pushNotifications: {
          messages: true,
          taskUpdates: true,
          mentions: true,
          reminders: true,
        },
        inAppNotifications: {
          enableAll: true,
        },
        completedOnboarding: false,
        language: 'en',
        timezone: 'UTC+7',
        dateFormat: 'dd/mm/yyyy',
        timeFormat: '24h',
      });
    }
  },
});

export const updateUser = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.optional(UserStatus),
    statusMessage: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!user) throw new Error('User not found');

    const updates: any = {};
    if (args.firstName !== undefined) updates.firstName = args.firstName;
    if (args.lastName !== undefined) updates.lastName = args.lastName;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.status !== undefined) updates.status = args.status;
    if (args.statusMessage !== undefined)
      updates.statusMessage = args.statusMessage;
    if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl;

    await ctx.db.patch(user._id, updates);

    return { success: true };
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', clerkId))
      .first();

    if (user) {
      const settings = await ctx.db
        .query('userSettings')
        .withIndex('by_user', q => q.eq('userId', user._id))
        .first();

      if (settings) {
        await ctx.db.delete(settings._id);
      }

      if (user.imageStorageId) {
        try {
          await ctx.storage.delete(user.imageStorageId);
          console.log(`Deleted profile image for user ${user.email}`);
        } catch (error) {
          console.error('Failed to delete profile image:', error);
        }
      }

      await ctx.db.delete(user._id);
      console.log(`User ${user.email} permanently deleted`);
    }
  },
});

// SETTINGS - Query only
export const getUserSettings = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!user) return null;

    const settings = await ctx.db
      .query('userSettings')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .first();

    return settings;
  },
});

// Update notification settings
export const updateNotificationSettings = mutation({
  args: {
    emailNotifications: v.optional(
      v.object({
        newWorkspace: v.boolean(),
        invitation: v.boolean(),
        taskAssigned: v.boolean(),
        comments: v.boolean(),
        weeklySummary: v.boolean(),
      }),
    ),
    pushNotifications: v.optional(
      v.object({
        messages: v.boolean(),
        taskUpdates: v.boolean(),
        mentions: v.boolean(),
        reminders: v.boolean(),
      }),
    ),
    inAppNotifications: v.optional(
      v.object({
        enableAll: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!user) throw new Error('User not found');

    const settings = await ctx.db
      .query('userSettings')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .first();

    if (!settings) throw new Error('Settings not found');

    const updates: any = {};

    if (args.emailNotifications) {
      updates.emailNotifications = args.emailNotifications;
    }
    if (args.pushNotifications) {
      updates.pushNotifications = args.pushNotifications;
    }
    if (args.inAppNotifications) {
      updates.inAppNotifications = args.inAppNotifications;
    }

    await ctx.db.patch(settings._id, updates);

    return { success: true };
  },
});

// Update language & region settings
export const updateLanguageSettings = mutation({
  args: {
    language: v.optional(v.string()),
    timezone: v.optional(v.string()),
    dateFormat: v.optional(v.string()),
    timeFormat: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!user) throw new Error('User not found');

    const settings = await ctx.db
      .query('userSettings')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .first();

    if (!settings) throw new Error('Settings not found');

    const updates: any = {};

    if (args.language) updates.language = args.language;
    if (args.timezone) updates.timezone = args.timezone;
    if (args.dateFormat) updates.dateFormat = args.dateFormat;
    if (args.timeFormat) updates.timeFormat = args.timeFormat;

    await ctx.db.patch(settings._id, updates);

    return { success: true };
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!user) throw new Error('User not found');

    const settings = await ctx.db
      .query('userSettings')
      .withIndex('by_user', q => q.eq('userId', user._id))
      .first();

    if (!settings) throw new Error('Settings not found');

    await ctx.db.patch(settings._id, { completedOnboarding: true });

    return { success: true };
  },
});
