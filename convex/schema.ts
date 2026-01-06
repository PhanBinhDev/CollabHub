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
  issueStages,
  labels,
  milestones,
  projects,
  stages,
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
  issueStages,
  stages,
});

export default schema;
