import { getAuthUserId } from '@convex-dev/auth/server';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const workspaces = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  imageStorageId: v.optional(v.id('_storage')),
  createdBy: v.id('users'),
}).index('by_creator', ['createdBy']);

export const workspaceMembers = defineTable({
  workspaceId: v.id('workspaces'),
  userId: v.id('users'),
  role: v.union(v.literal('owner'), v.literal('admin'), v.literal('member')),
  status: v.union(v.literal('active'), v.literal('pending')),
  invitedBy: v.optional(v.id('users')),
  invitedAt: v.number(),
  joinedAt: v.optional(v.number()),
})
  .index('by_workspace', ['workspaceId'])
  .index('by_user', ['userId'])
  .index('by_workspace_user', ['workspaceId', 'userId'])
  .index('by_workspace_status', ['workspaceId', 'status']);

export const workspaceFavorites = defineTable({
  userId: v.id('users'),
  workspaceId: v.id('workspaces'),
})
  .index('by_user', ['userId'])
  .index('by_user_workspace', ['userId', 'workspaceId']);

// Create a new workspace
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) throw new Error('User not found');

    const now = Date.now();

    // Create workspace
    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      description: args.description,
      imageStorageId: args.imageStorageId,
      createdBy: currentUser._id,
    });

    // Add creator as owner
    await ctx.db.insert('workspaceMembers', {
      workspaceId,
      userId: currentUser._id,
      role: 'owner',
      status: 'active',
      invitedAt: now,
      joinedAt: now,
    });

    return workspaceId;
  },
});

// Get user's workspaces
export const getUserWorkspaces = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) return [];

    // Get workspace memberships
    const memberships = await ctx.db
      .query('workspaceMembers')
      .withIndex('by_user', q => q.eq('userId', currentUser._id))
      .filter(q => q.eq(q.field('status'), 'active'))
      .collect();

    // Get favorites
    const favorites = await ctx.db
      .query('workspaceFavorites')
      .withIndex('by_user', q => q.eq('userId', currentUser._id))
      .collect();

    const favoriteWorkspaceIds = new Set(favorites.map(f => f.workspaceId));

    // Fetch workspaces with details
    const workspaces = await Promise.all(
      memberships.map(async membership => {
        const workspace = await ctx.db.get(membership.workspaceId);
        if (!workspace) return null;

        // Get member count
        const members = await ctx.db
          .query('workspaceMembers')
          .withIndex('by_workspace_status', q =>
            q.eq('workspaceId', membership.workspaceId).eq('status', 'active'),
          )
          .collect();

        // Get image URL if exists
        let imageUrl = null;
        if (workspace.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(workspace.imageStorageId);
        }

        return {
          _id: workspace._id,
          name: workspace.name,
          description: workspace.description,
          imageUrl,
          role: membership.role,
          memberCount: members.length,
          isFavorite: favoriteWorkspaceIds.has(workspace._id),
        };
      }),
    );

    return workspaces.filter(w => w !== null);
  },
});

// Get workspace by ID
export const getWorkspaceById = query({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) throw new Error('User not found');

    // Check membership
    const membership = await ctx.db
      .query('workspaceMembers')
      .withIndex('by_workspace_user', q =>
        q.eq('workspaceId', args.workspaceId).eq('userId', currentUser._id),
      )
      .first();

    if (!membership || membership.status !== 'active') {
      throw new Error('Access denied');
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    // Get member count
    const members = await ctx.db
      .query('workspaceMembers')
      .withIndex('by_workspace_status', q =>
        q.eq('workspaceId', args.workspaceId).eq('status', 'active'),
      )
      .collect();

    // Get image URL
    let imageUrl = null;
    if (workspace.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(workspace.imageStorageId);
    }

    return {
      _id: workspace._id,
      name: workspace.name,
      description: workspace.description,
      imageUrl,
      role: membership.role,
      memberCount: members.length,
    };
  },
});

// Update workspace
export const update = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) throw new Error('User not found');

    // Check admin/owner permission
    const membership = await ctx.db
      .query('workspaceMembers')
      .withIndex('by_workspace_user', q =>
        q.eq('workspaceId', args.workspaceId).eq('userId', currentUser._id),
      )
      .first();

    if (
      !membership ||
      membership.status !== 'active' ||
      (membership.role !== 'admin' && membership.role !== 'owner')
    ) {
      throw new Error('Access denied');
    }

    const updates: Partial<Doc<'workspaces'>> = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.imageStorageId !== undefined)
      updates.imageStorageId = args.imageStorageId;

    await ctx.db.patch(args.workspaceId, updates);
  },
});

// Toggle favorite
export const toggleFavorite = mutation({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) throw new Error('User not found');

    const existing = await ctx.db
      .query('workspaceFavorites')
      .withIndex('by_user_workspace', q =>
        q.eq('userId', currentUser._id).eq('workspaceId', args.workspaceId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert('workspaceFavorites', {
        userId: currentUser._id,
        workspaceId: args.workspaceId,
      });
    }
  },
});

// Delete workspace (owner only)
export const deleteWorkspace = mutation({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', userId))
      .first();

    if (!currentUser) throw new Error('User not found');

    const membership = await ctx.db
      .query('workspaceMembers')
      .withIndex('by_workspace_user', q =>
        q.eq('workspaceId', args.workspaceId).eq('userId', currentUser._id),
      )
      .first();

    if (!membership || membership.role !== 'owner') {
      throw new Error('Only owner can delete workspace');
    }

    // Delete all members
    const members = await ctx.db
      .query('workspaceMembers')
      .withIndex('by_workspace', q => q.eq('workspaceId', args.workspaceId))
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete favorites
    const favorites = await ctx.db.query('workspaceFavorites').collect();

    for (const fav of favorites) {
      if (fav.workspaceId === args.workspaceId) {
        await ctx.db.delete(fav._id);
      }
    }

    // Delete workspace
    await ctx.db.delete(args.workspaceId);
  },
});
