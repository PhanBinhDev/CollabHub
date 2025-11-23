import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const generateUploadUrl = mutation({
  args: {},
  handler: async ctx => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const saveProfileImage = mutation({
  args: { 
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!user) throw new Error('User not found');

    if (user.imageStorageId) {
      try {
        await ctx.storage.delete(user.imageStorageId);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    
    await ctx.db.patch(user._id, {
      imageUrl: imageUrl ?? undefined,
      imageStorageId: args.storageId,
    });

    return { success: true, imageUrl };
  },
});

export const deleteProfileImage = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!user) throw new Error('User not found');

    if (user.imageStorageId) {
      try {
        await ctx.storage.delete(user.imageStorageId);
      } catch (error) {
        console.error('Failed to delete image from storage:', error);
      }
    }

    await ctx.db.patch(user._id, {
      imageUrl: undefined,
      imageStorageId: undefined,
    });

    return { success: true };
  },
});