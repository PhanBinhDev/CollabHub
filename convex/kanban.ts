import { defineTable } from 'convex/server';
import { v } from 'convex/values';

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
  status: v.union(MilestoneStatus),
}).index('by_project', ['projectId']);

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
}).index('by_project', ['projectId']);

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
}).index('by_issue', ['issueId']);

export const issueActivity = defineTable({
  issueId: v.id('issues'),
  userId: v.string(),
  action: v.string(),
  oldValue: v.optional(v.string()),
  newValue: v.optional(v.string()),
}).index('by_issue', ['issueId']);
