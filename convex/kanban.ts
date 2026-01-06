import { defineTable } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const PriorityStatus = v.union(
  v.literal('urgent'),
  v.literal('high'),
  v.literal('medium'),
  v.literal('low'),
);

export const MilestoneStatus = v.union(
  v.literal('active'),
  v.literal('completed'),
  v.literal('archived'),
);

export const projects = defineTable({
  orgId: v.string(),
  name: v.string(),
  key: v.string(),
  description: v.optional(v.string()),
  icon: v.optional(v.string()),
  createdBy: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_org', ['orgId'])
  .index('by_org_and_key', ['orgId', 'key']);

export const stages = defineTable({
  orgId: v.string(),
  projectId: v.id('projects'),
  name: v.string(),
  order: v.number(),
  color: v.optional(v.string()),
})
  .index('by_project', ['projectId'])
  .index('by_org', ['orgId']);

export const issues = defineTable({
  orgId: v.string(),
  projectId: v.id('projects'),
  issueNumber: v.number(),
  title: v.string(),
  description: v.optional(v.string()),
  status: v.string(),
  priority: v.optional(PriorityStatus),
  assignedTo: v.optional(v.string()),
  createdBy: v.string(),
  estimation: v.optional(v.string()),
  spentTime: v.optional(v.string()),
  deadline: v.optional(v.number()),
  parentIssueId: v.optional(v.id('issues')),
})
  .index('by_project', ['projectId'])
  .index('by_org', ['orgId'])
  .index('by_project_and_number', ['projectId', 'issueNumber'])
  .index('by_assignee', ['assignedTo'])
  .index('by_status', ['status'])
  .index('by_parent', ['parentIssueId']);

export const issueStages = defineTable({
  issueId: v.id('issues'),
  stageId: v.id('stages'),
})
  .index('by_issue', ['issueId'])
  .index('by_stage', ['stageId']);

export const labels = defineTable({
  orgId: v.string(),
  projectId: v.optional(v.id('projects')),
  name: v.string(),
  color: v.string(),
})
  .index('by_org', ['orgId'])
  .index('by_project', ['projectId']);

export const issueLabels = defineTable({
  issueId: v.id('issues'),
  labelId: v.id('labels'),
})
  .index('by_issue', ['issueId'])
  .index('by_label', ['labelId']);

export const milestones = defineTable({
  orgId: v.string(),
  projectId: v.id('projects'),
  name: v.string(),
  description: v.optional(v.string()),
  dueDate: v.optional(v.number()),
  status: MilestoneStatus,
})
  .index('by_project', ['projectId'])
  .index('by_org', ['orgId']);

export const issueMilestones = defineTable({
  issueId: v.id('issues'),
  milestoneId: v.id('milestones'),
})
  .index('by_issue', ['issueId'])
  .index('by_milestone', ['milestoneId']);

export const components = defineTable({
  orgId: v.string(),
  projectId: v.id('projects'),
  name: v.string(),
  description: v.optional(v.string()),
})
  .index('by_project', ['projectId'])
  .index('by_org', ['orgId']);

export const issueComponents = defineTable({
  issueId: v.id('issues'),
  componentId: v.id('components'),
})
  .index('by_issue', ['issueId'])
  .index('by_component', ['componentId']);

export const issueComments = defineTable({
  issueId: v.id('issues'),
  userId: v.string(),
  content: v.string(),
  createdAt: v.number(),
})
  .index('by_issue', ['issueId'])
  .index('by_user', ['userId']);

export const issueActivity = defineTable({
  issueId: v.id('issues'),
  userId: v.string(),
  action: v.string(),
  oldValue: v.optional(v.string()),
  newValue: v.optional(v.string()),
  createdAt: v.number(),
})
  .index('by_issue', ['issueId'])
  .index('by_user', ['userId']);

// ==================== QUERIES ====================

// Projects
export const getProjects = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.db
      .query('projects')
      .withIndex('by_org', q => q.eq('orgId', orgId))
      .order('desc')
      .collect();
  },
});

export const getProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) throw new ConvexError('Project not found');
    return project;
  },
});

// Stages
export const getStages = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query('stages')
      .withIndex('by_project', q => q.eq('projectId', projectId))
      .collect();
  },
});

// Issues
export const getIssues = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query('issues')
      .withIndex('by_project', q => q.eq('projectId', projectId))
      .order('desc')
      .collect();
  },
});

export const getIssue = query({
  args: { issueId: v.id('issues') },
  handler: async (ctx, { issueId }) => {
    const issue = await ctx.db.get(issueId);
    if (!issue) throw new ConvexError('Issue not found');
    return issue;
  },
});

// Kanban Board
export const getKanbanBoard = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const stages = await ctx.db
      .query('stages')
      .withIndex('by_project', q => q.eq('projectId', projectId))
      .collect();

    const issues = await ctx.db
      .query('issues')
      .withIndex('by_project', q => q.eq('projectId', projectId))
      .collect();

    const issueStages = await ctx.db.query('issueStages').collect();
    const issueStageMap = new Map(
      issueStages.map(is => [is.issueId, is.stageId]),
    );

    const stagesWithIssues = stages.map(stage => ({
      ...stage,
      issues: issues.filter(
        issue => issueStageMap.get(issue._id) === stage._id,
      ),
    }));

    return stagesWithIssues;
  },
});

// ==================== MUTATIONS ====================

// Projects
export const createProject = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
    key: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('projects', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, ...updates }) => {
    const project = await ctx.db.get(projectId);
    if (!project) throw new ConvexError('Project not found');

    await ctx.db.patch(projectId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteProject = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) throw new ConvexError('Project not found');
    await ctx.db.delete(projectId);
  },
});

// Stages
export const createStage = mutation({
  args: {
    orgId: v.string(),
    projectId: v.id('projects'),
    name: v.string(),
    order: v.number(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('stages', args);
  },
});

export const updateStage = mutation({
  args: {
    stageId: v.id('stages'),
    name: v.optional(v.string()),
    order: v.optional(v.number()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, { stageId, ...updates }) => {
    const stage = await ctx.db.get(stageId);
    if (!stage) throw new ConvexError('Stage not found');
    await ctx.db.patch(stageId, updates);
  },
});

export const deleteStage = mutation({
  args: { stageId: v.id('stages') },
  handler: async (ctx, { stageId }) => {
    const stage = await ctx.db.get(stageId);
    if (!stage) throw new ConvexError('Stage not found');

    const issueStages = await ctx.db
      .query('issueStages')
      .withIndex('by_stage', q => q.eq('stageId', stageId))
      .collect();

    for (const is of issueStages) {
      await ctx.db.delete(is._id);
    }

    await ctx.db.delete(stageId);
  },
});

// Issues
export const createIssue = mutation({
  args: {
    orgId: v.string(),
    projectId: v.id('projects'),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.optional(PriorityStatus),
    assignedTo: v.optional(v.string()),
    createdBy: v.string(),
    stageId: v.optional(v.id('stages')),
  },
  handler: async (ctx, { stageId, ...args }) => {
    const lastIssue = await ctx.db
      .query('issues')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .order('desc')
      .first();

    const issueNumber = lastIssue ? lastIssue.issueNumber + 1 : 1;

    const issueId = await ctx.db.insert('issues', {
      ...args,
      issueNumber,
    });

    if (stageId) {
      await ctx.db.insert('issueStages', { issueId, stageId });
    }

    return issueId;
  },
});

export const updateIssue = mutation({
  args: {
    issueId: v.id('issues'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(PriorityStatus),
    assignedTo: v.optional(v.string()),
    estimation: v.optional(v.string()),
    spentTime: v.optional(v.string()),
    deadline: v.optional(v.number()),
  },
  handler: async (ctx, { issueId, ...updates }) => {
    const issue = await ctx.db.get(issueId);
    if (!issue) throw new ConvexError('Issue not found');
    await ctx.db.patch(issueId, updates);
  },
});

export const deleteIssue = mutation({
  args: { issueId: v.id('issues') },
  handler: async (ctx, { issueId }) => {
    const issue = await ctx.db.get(issueId);
    if (!issue) throw new ConvexError('Issue not found');

    const issueStage = await ctx.db
      .query('issueStages')
      .withIndex('by_issue', q => q.eq('issueId', issueId))
      .first();
    if (issueStage) await ctx.db.delete(issueStage._id);

    await ctx.db.delete(issueId);
  },
});

export const moveIssueToStage = mutation({
  args: {
    issueId: v.id('issues'),
    stageId: v.id('stages'),
  },
  handler: async (ctx, { issueId, stageId }) => {
    const issue = await ctx.db.get(issueId);
    if (!issue) throw new ConvexError('Issue not found');

    const stage = await ctx.db.get(stageId);
    if (!stage) throw new ConvexError('Stage not found');

    const oldMapping = await ctx.db
      .query('issueStages')
      .withIndex('by_issue', q => q.eq('issueId', issueId))
      .first();

    if (oldMapping) {
      await ctx.db.delete(oldMapping._id);
    }

    return await ctx.db.insert('issueStages', { issueId, stageId });
  },
});
