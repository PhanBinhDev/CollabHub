import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

const images: string[] = [
  'https://source.unsplash.com/featured/300x200/?nature,water',
  'https://source.unsplash.com/featured/300x200/?technology,abstract',
  'https://source.unsplash.com/featured/300x200/?city,night',
];

export const boards = defineTable({
  title: v.string(),
  orgId: v.string(),
  authorId: v.string(),
  authorName: v.string(),
  imageUrl: v.string(),
})
  .index('by_org', ['orgId'])
  .searchIndex('search_by_title', {
    searchField: 'title',
    filterFields: ['orgId'],
  });

export type Board = Doc<'boards'>;

export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, { title, orgId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert('boards', {
      title,
      orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

export const deleteBoard = mutation({
  args: {
    boardId: v.id('boards'),
  },
  handler: async (ctx, { boardId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const board = await ctx.db.get(boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.authorId !== identity.subject) {
      throw new Error('Forbidden');
    }

    await ctx.db.delete(boardId);
  },
});

export const get = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const boards = await ctx.db
      .query('boards')
      .withIndex('by_org', q => q.eq('orgId', orgId))
      .order('desc')
      .collect();

    return boards;
  },
});
