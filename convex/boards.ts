import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import { Doc } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';

const images: string[] = [
  'https://source.unsplash.com/featured/300x200/?nature,water',
  'https://source.unsplash.com/featured/300x200/?technology,abstract',
  'https://source.unsplash.com/featured/300x200/?city,night',
];

export const FilterBoard = v.union(
  v.literal('anyone'),
  v.literal('ownerByMe'),
  v.literal('notOwnerByMe'),
  v.literal('starred'),
  v.literal('shared'),
);

export const SortBoard = v.union(
  v.literal('lastModified'),
  v.literal('lastOpened'),
  v.literal('createdAt'),
  v.literal('nameAsc'),
  v.literal('nameDesc'),
);

export const BoardVisibility = v.union(
  v.literal('private'),
  v.literal('organization'),
  v.literal('public'),
);

export const BoardMemberRole = v.union(
  v.literal('owner'),
  v.literal('editor'),
  v.literal('commenter'),
  v.literal('viewer'),
);

export type FilterBoardValue = typeof FilterBoard.type;
export type SortBoardValue = typeof SortBoard.type;
export type BoardVisibilityValue = typeof BoardVisibility.type;
export type BoardMemberRoleValue = typeof BoardMemberRole.type;

export const boards = defineTable({
  title: v.string(),
  orgId: v.string(),
  authorId: v.string(),
  authorName: v.string(),
  imageUrl: v.string(),
  visibility: v.union(
    v.literal('private'),
    v.literal('organization'),
    v.literal('public'),
  ),
  lastModifiedTime: v.optional(v.number()),
  lastOpenedTime: v.optional(v.number()),
})
  .index('by_org', ['orgId'])
  .index('by_author', ['authorId'])
  .index('by_visibility', ['visibility'])
  .searchIndex('search_by_title', {
    searchField: 'title',
    filterFields: ['orgId'],
  });

export const userBoardFavorites = defineTable({
  userId: v.string(),
  boardId: v.id('boards'),
  orgId: v.string(),
})
  .index('by_user_board', ['userId', 'boardId'])
  .index('by_user_org', ['userId', 'orgId'])
  .index('by_board', ['boardId']);

export const boardMembers = defineTable({
  boardId: v.id('boards'),
  userId: v.string(),
  role: BoardMemberRole,
  addedBy: v.string(),
  addedAt: v.number(),
})
  .index('by_board', ['boardId'])
  .index('by_user', ['userId'])
  .index('by_board_user', ['boardId', 'userId']);

export const boardShareLinks = defineTable({
  boardId: v.id('boards'),
  shareId: v.string(),
  role: v.union(v.literal('editor'), v.literal('viewer')),
  expiresAt: v.optional(v.number()),
  createdBy: v.string(),
  createdAt: v.number(),
})
  .index('by_board', ['boardId'])
  .index('by_share_id', ['shareId']);

export type Board = Doc<'boards'>;
export type UserFavorite = Doc<'userBoardFavorites'>;
export type BoardMember = Doc<'boardMembers'>;
export type BoardShareLink = Doc<'boardShareLinks'>;
export interface BoardWithMetadata extends Board {
  isFavorite: boolean;
  isOwner: boolean;
  userRole: BoardMemberRoleValue;
}

export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
    visibility: v.optional(BoardVisibility),
  },
  handler: async (ctx, { title, orgId, visibility = 'organization' }) => {
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
      visibility,
      lastModifiedTime: Date.now(),
    });

    await ctx.db.insert('boardMembers', {
      boardId: board,
      userId: identity.subject,
      role: 'owner',
      addedBy: identity.subject,
      addedAt: Date.now(),
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

    const favorites = await ctx.db
      .query('userBoardFavorites')
      .withIndex('by_board', q => q.eq('boardId', boardId))
      .collect();
    for (const favorite of favorites) {
      await ctx.db.delete(favorite._id);
    }

    const members = await ctx.db
      .query('boardMembers')
      .withIndex('by_board', q => q.eq('boardId', boardId))
      .collect();
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    const shareLinks = await ctx.db
      .query('boardShareLinks')
      .withIndex('by_board', q => q.eq('boardId', boardId))
      .collect();
    for (const link of shareLinks) {
      await ctx.db.delete(link._id);
    }

    await ctx.db.delete(boardId);
  },
});

export const updateTitle = mutation({
  args: {
    boardId: v.id('boards'),
    newTitle: v.string(),
  },
  handler: async (ctx, { boardId, newTitle }) => {
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

    await ctx.db.patch(boardId, {
      title: newTitle,
      lastModifiedTime: Date.now(),
    });
  },
});

export const updateVisibility = mutation({
  args: {
    boardId: v.id('boards'),
    visibility: BoardVisibility,
  },
  handler: async (ctx, { boardId, visibility }) => {
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

    await ctx.db.patch(boardId, {
      visibility,
      lastModifiedTime: Date.now(),
    });

    return { visibility };
  },
});

export const toggleFavorite = mutation({
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

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query('userBoardFavorites')
      .withIndex('by_user_board', q =>
        q.eq('userId', userId).eq('boardId', boardId),
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
      return { isFavorite: false };
    } else {
      await ctx.db.insert('userBoardFavorites', {
        userId,
        boardId,
        orgId: board.orgId,
      });
      return { isFavorite: true };
    }
  },
});

export const addMember = mutation({
  args: {
    boardId: v.id('boards'),
    userId: v.string(),
    role: v.union(v.literal('editor'), v.literal('viewer')),
  },
  handler: async (ctx, { boardId, userId, role }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const board = await ctx.db.get(boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.authorId !== identity.subject) {
      throw new Error('Only owner can add members');
    }

    const existingMember = await ctx.db
      .query('boardMembers')
      .withIndex('by_board_user', q =>
        q.eq('boardId', boardId).eq('userId', userId),
      )
      .unique();

    if (existingMember) {
      throw new Error('User is already a member');
    }

    await ctx.db.insert('boardMembers', {
      boardId,
      userId,
      role,
      addedBy: identity.subject,
      addedAt: Date.now(),
    });
  },
});

export const removeMember = mutation({
  args: {
    boardId: v.id('boards'),
    userId: v.string(),
  },
  handler: async (ctx, { boardId, userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const board = await ctx.db.get(boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.authorId !== identity.subject && userId !== identity.subject) {
      throw new Error('Forbidden');
    }

    const member = await ctx.db
      .query('boardMembers')
      .withIndex('by_board_user', q =>
        q.eq('boardId', boardId).eq('userId', userId),
      )
      .unique();

    if (member) {
      await ctx.db.delete(member._id);
    }
  },
});

export const get = query({
  args: {
    orgId: v.string(),
    filter: v.optional(FilterBoard),
    sort: v.optional(SortBoard),
  },
  handler: async (ctx, { orgId, filter = 'anyone', sort = 'lastModified' }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const userId = identity.subject;

    let boards = await ctx.db
      .query('boards')
      .withIndex('by_org', q => q.eq('orgId', orgId))
      .collect();

    switch (filter) {
      case 'ownerByMe':
        boards = boards.filter(board => board.authorId === userId);
        break;

      case 'notOwnerByMe':
        boards = boards.filter(board => board.authorId !== userId);
        break;

      case 'starred':
        const favorites = await ctx.db
          .query('userBoardFavorites')
          .withIndex('by_user_org', q =>
            q.eq('userId', userId).eq('orgId', orgId),
          )
          .collect();
        const favoriteIds = new Set(favorites.map(f => f.boardId));
        boards = boards.filter(board => favoriteIds.has(board._id));
        break;

      case 'shared':
        const memberships = await ctx.db
          .query('boardMembers')
          .withIndex('by_user', q => q.eq('userId', userId))
          .collect();
        const sharedBoardIds = new Set(
          memberships
            .map(m => m.boardId)
            .filter(id => {
              const board = boards.find(b => b._id === id);
              return board && board.authorId !== userId;
            }),
        );
        boards = boards.filter(board => sharedBoardIds.has(board._id));
        break;

      case 'anyone':
      default:
        boards = boards.filter(board => {
          if (board.authorId === userId) return true;
          if (board.visibility === 'organization') return true;
          if (board.visibility === 'public') return true;
          return false;
        });
        break;
    }

    switch (sort) {
      case 'lastModified':
        boards.sort(
          (a, b) =>
            (b.lastModifiedTime || b._creationTime) -
            (a.lastModifiedTime || a._creationTime),
        );
        break;

      case 'lastOpened':
        boards.sort(
          (a, b) =>
            (b.lastOpenedTime || b._creationTime) -
            (a.lastOpenedTime || a._creationTime),
        );
        break;

      case 'createdAt':
        boards.sort((a, b) => b._creationTime - a._creationTime);
        break;

      case 'nameAsc':
        boards.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case 'nameDesc':
        boards.sort((a, b) => b.title.localeCompare(a.title));
        break;

      default:
        boards.sort((a, b) => b._creationTime - a._creationTime);
    }

    const boardsWithMetadata = await Promise.all(
      boards.map(async board => {
        const favorite = await ctx.db
          .query('userBoardFavorites')
          .withIndex('by_user_board', q =>
            q.eq('userId', userId).eq('boardId', board._id),
          )
          .unique();

        const membership = await ctx.db
          .query('boardMembers')
          .withIndex('by_board_user', q =>
            q.eq('boardId', board._id).eq('userId', userId),
          )
          .unique();

        return {
          ...board,
          isFavorite: !!favorite,
          userRole: membership?.role,
          isOwner: board.authorId === userId,
        };
      }),
    );

    return boardsWithMetadata as BoardWithMetadata[];
  },
});

export const createShareLink = mutation({
  args: {
    boardId: v.id('boards'),
    role: v.union(v.literal('editor'), v.literal('viewer')),
    expiresInDays: v.optional(v.number()),
  },
  handler: async (ctx, { boardId, role, expiresInDays }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const board = await ctx.db.get(boardId);
    if (!board) throw new Error('Board not found');

    // Only owner can create share links
    if (board.authorId !== identity.subject) {
      throw new Error('Only owner can create share links');
    }

    const shareId = crypto.randomUUID();
    const expiresAt = expiresInDays
      ? Date.now() + expiresInDays * 24 * 60 * 60 * 1000
      : undefined;

    await ctx.db.insert('boardShareLinks', {
      boardId,
      shareId,
      role,
      expiresAt,
      createdBy: identity.subject,
      createdAt: Date.now(),
    });

    return { shareId, expiresAt };
  },
});

export const joinViaShareLink = mutation({
  args: {
    shareId: v.string(),
  },
  handler: async (ctx, { shareId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const shareLink = await ctx.db
      .query('boardShareLinks')
      .withIndex('by_share_id', q => q.eq('shareId', shareId))
      .unique();

    if (!shareLink) throw new Error('Invalid share link');

    if (shareLink.expiresAt && shareLink.expiresAt < Date.now()) {
      throw new Error('Share link expired');
    }

    const board = await ctx.db.get(shareLink.boardId);
    if (!board) throw new Error('Board not found');

    const existing = await ctx.db
      .query('boardMembers')
      .withIndex('by_board_user', q =>
        q.eq('boardId', shareLink.boardId).eq('userId', identity.subject),
      )
      .unique();

    if (existing) {
      return { boardId: shareLink.boardId, alreadyMember: true };
    }

    await ctx.db.insert('boardMembers', {
      boardId: shareLink.boardId,
      userId: identity.subject,
      role: shareLink.role,
      addedBy: shareLink.createdBy,
      addedAt: Date.now(),
    });

    return { boardId: shareLink.boardId, alreadyMember: false };
  },
});

export const getDetails = query({
  args: { id: v.id('boards') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const board = await ctx.db.get(args.id);

    if (!board) return null;

    if (!identity) {
      console.log('🚫 UNAUTHORIZED ACCESS ATTEMPT TO BOARD DETAILS', identity);

      return {
        ...board,
        isFavorite: false,
        userRole: 'viewer',
        isOwner: false,
      } as BoardWithMetadata;
    }

    const userId = identity.subject;

    const favorite = await ctx.db
      .query('userBoardFavorites')
      .withIndex('by_user_board', q =>
        q.eq('userId', userId).eq('boardId', board._id),
      )
      .unique();

    const membership = await ctx.db
      .query('boardMembers')
      .withIndex('by_board_user', q =>
        q.eq('boardId', board._id).eq('userId', userId),
      )
      .unique();

    return {
      ...board,
      isFavorite: !!favorite,
      userRole: membership?.role,
      isOwner: board.authorId === userId,
    } as BoardWithMetadata;
  },
});

export const getShareLinkWithBoard = query({
  args: { shareId: v.string() },
  handler: async (ctx, { shareId }) => {
    const link = await ctx.db
      .query('boardShareLinks')
      .withIndex('by_share_id', q => q.eq('shareId', shareId))
      .unique();

    if (!link) return null;

    if (link.expiresAt && link.expiresAt < Date.now()) {
      return null;
    }

    const board = await ctx.db.get(link.boardId);
    if (!board) return null;

    return {
      ...link,
      board: {
        id: board._id,
        title: board.title,
        imageUrl: board.imageUrl,
        visibility: board.visibility,
      },
    };
  },
});

export const getBoardShareLinks = query({
  args: { boardId: v.id('boards') },
  handler: async (ctx, { boardId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const board = await ctx.db.get(boardId);
    if (!board) throw new Error('Board not found');

    if (board.authorId !== identity.subject) {
      throw new Error('Only owner can view share links');
    }

    const links = await ctx.db
      .query('boardShareLinks')
      .withIndex('by_board', q => q.eq('boardId', boardId))
      .collect();

    return links.filter(link => !link.expiresAt || link.expiresAt > Date.now());
  },
});

export const deleteShareLink = mutation({
  args: {
    boardId: v.id('boards'),
    shareId: v.string(),
  },
  handler: async (ctx, { boardId, shareId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const board = await ctx.db.get(boardId);
    if (!board) throw new Error('Board not found');

    if (board.authorId !== identity.subject) {
      throw new Error('Only owner can delete share links');
    }

    const link = await ctx.db
      .query('boardShareLinks')
      .withIndex('by_share_id', q => q.eq('shareId', shareId))
      .unique();

    if (link && link.boardId === boardId) {
      await ctx.db.delete(link._id);
    }
  },
});

export const deleteBoardsByOrg = internalMutation({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const boards = await ctx.db
      .query('boards')
      .withIndex('by_org', q => q.eq('orgId', orgId))
      .collect();

    for (const board of boards) {
      await ctx.runMutation(api.boards.deleteBoard, { boardId: board._id });
    }
  },
});
