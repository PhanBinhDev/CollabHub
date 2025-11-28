import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { mutation } from './_generated/server';

const images = [];

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
  },
});
