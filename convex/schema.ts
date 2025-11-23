import { defineSchema } from 'convex/server';
import { notificationsTable } from './notifications';
import { userSettingsTable, usersTable } from './users';
import { workspaceFavorites, workspaceMembers, workspaces } from './workspaces';
import { pendingSessions } from './sessions';
import { emailVerifications } from './emails';

const schema = defineSchema({
  users: usersTable,
  notifications: notificationsTable,
  workspaces,
  workspaceMembers,
  workspaceFavorites,
  userSettings: userSettingsTable,
  pendingSessions,
  emailVerifications,
});

export default schema;
