import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { INTERVAL } from './../src/constants/app';
import { internal } from './_generated/api';
import { internalMutation, mutation } from './_generated/server';

export const emailVerifications = defineTable({
  emailId: v.string(),
  createdAt: v.number(),
}).index('by_email', ['emailId']);

export const tryCreateVerification = mutation({
  args: { emailId: v.string(), minIntervalSeconds: v.number() },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - args.minIntervalSeconds * 1000;
    const recent = await ctx.db
      .query('emailVerifications')
      .withIndex('by_email', q => q.eq('emailId', args.emailId))
      .filter(q => q.gt(q.field('createdAt'), cutoff))
      .first();

    if (recent) {
      const retryAfter = Math.ceil(
        (recent.createdAt + args.minIntervalSeconds * 1000 - Date.now()) / 1000,
      );
      return { allowed: false, retryAfter };
    }

    const id = await ctx.db.insert('emailVerifications', {
      emailId: args.emailId,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(
      INTERVAL * 1000,
      internal.emails.deleteEmailVerification,
      { id },
    );

    return { allowed: true, id };
  },
});

export const deleteEmailVerification = internalMutation({
  args: { id: v.id('emailVerifications') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
