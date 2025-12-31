import { defineSchema } from 'convex/server';
import { documents } from './documents';
import { emailVerifications } from './emails';
import {
  components,
  issueActivity,
  issueComments,
  issueComponents,
  issueLabels,
  issueMilestones,
  issues,
  labels,
  milestones,
  projects,
} from './kanban';
import { notifications } from './notifications';
import { pendingSessions } from './sessions';
import { users, userSettings } from './users';

const schema = defineSchema({
  users,
  notifications,
  userSettings,
  pendingSessions,
  emailVerifications,
  documents,
  projects,
  issues,
  labels,
  issueLabels,
  milestones,
  issueMilestones,
  components,
  issueComponents,
  issueComments,
  issueActivity,
});

export default schema;
