import { defineSchema } from 'convex/server';
import { notificationsTable } from './notifications';
import { userSettingsTable, usersTable } from './users';
import { workspaceMembers, workspaces } from './workspaces';
import { pendingSessions } from './sessions';

const schema = defineSchema({
  users: usersTable,
  notifications: notificationsTable,
  workspaces,
  workspaceMembers,
  userSettings: userSettingsTable,
  pendingSessions
});

export default schema;
