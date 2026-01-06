/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defineTable,
  paginationOptsValidator,
  PaginationResult,
} from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const documents = defineTable({
  title: v.string(),
  initialContent: v.optional(v.string()),
  authorId: v.string(),
  roomId: v.optional(v.string()),
  orgId: v.optional(v.string()),
})
  .index('by_author_id', ['authorId'])
  .index('by_organization_id', ['orgId'])
  .searchIndex('search_title', {
    searchField: 'title',
    filterFields: ['authorId', 'orgId'],
  });

export const getByIds = query({
  args: { ids: v.array(v.id('documents')) },
  handler: async (ctx, { ids }) => {
    const documents = [];

    for (const id of ids) {
      const document = await ctx.db.get(id);

      if (document) {
        documents.push({ id: document._id, name: document.title });
      } else {
        documents.push({ id, name: '[Removed]' });
      }
    }

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError('Unathorized');
    }

    return ctx.db.insert('documents', {
      title: args.title ?? 'Untitled document',
      authorId: user.subject,
      orgId: args.orgId,
      initialContent: args.initialContent,
    });
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    orgId: v.string(),
  },
  handler: async (ctx, { search, paginationOpts, orgId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError('Unauthorized');
    }

    let results: PaginationResult<Doc<'documents'>>;
    if (search && orgId) {
      results = await ctx.db
        .query('documents')
        .withSearchIndex('search_title', q =>
          q.search('title', search).eq('orgId', orgId),
        )
        .paginate(paginationOpts);
    } else if (search) {
      results = await ctx.db
        .query('documents')
        .withSearchIndex('search_title', q =>
          q.search('title', search).eq('authorId', user.subject),
        )
        .paginate(paginationOpts);
    } else if (orgId) {
      results = await ctx.db
        .query('documents')
        .withIndex('by_organization_id', q => q.eq('orgId', orgId))
        .paginate(paginationOpts);
    } else {
      results = await ctx.db
        .query('documents')
        .withIndex('by_author_id', q => q.eq('authorId', user.subject))
        .paginate(paginationOpts);
    }

    const authorIds = Array.from(
      new Set(results.page.map(doc => doc.authorId)),
    );

    const authors = await Promise.all(
      authorIds.map(async authorId => {
        const author = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', q => q.eq('clerkId', authorId))
          .first();
        if (!author) return null;
        return {
          clerkId: author.clerkId,
          email: author.email,
          username: author.username,
          firstName: author.firstName,
          lastName: author.lastName,
          imageUrl: author.imageUrl,
        };
      }),
    );
    const authorMap: Record<string, (typeof authors)[number]> = {};
    authors.forEach(author => {
      if (author) authorMap[author.clerkId] = author;
    });

    const page = results.page.map((doc: any) => ({
      ...doc,
      author: authorMap[doc.authorId] ?? null,
    }));

    return {
      ...results,
      page,
    };
  },
});

export const removeById = mutation({
  args: { id: v.id('documents'), orgId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError('Unauthorized');
    }

    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new ConvexError('Document not found');
    }

    const isOwner = document.authorId === user.subject;
    const isOrganizationMember = !!(
      document.orgId && document.orgId === args.orgId
    );
    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError('Unauthorized');
    }

    return await ctx.db.delete(args.id);
  },
});

export const updateById = mutation({
  args: { id: v.id('documents'), title: v.string(), orgId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError('Unauthorized');
    }

    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new ConvexError('Document not found');
    }

    const isOwner = document.authorId === user.subject;
    const isOrganizationMember = !!(
      document.orgId && document.orgId === args.orgId
    );

    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError('Unauthorized');
    }

    return await ctx.db.patch(args.id, { title: args.title });
  },
});

export const getById = query({
  args: { id: v.id('documents') },
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id);

    if (!document) {
      throw new ConvexError('Document not found');
    }

    return document;
  },
});
