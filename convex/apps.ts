import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const appIntegrations = defineTable({
  userId: v.id('users'),
  workspaceId: v.optional(v.id('workspaces')),
  appId: v.string(),
  appName: v.string(),
  connected: v.boolean(),
  config: v.optional(v.any()),
  accessToken: v.optional(v.string()),
  refreshToken: v.optional(v.string()),
  expiresAt: v.optional(v.number()),
  connectedAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_user', ['userId'])
  .index('by_workspace', ['workspaceId'])
  .index('by_user_app', ['userId', 'appId']);
