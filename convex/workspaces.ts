import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const workspaces = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  avatar: v.optional(v.string()),
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
