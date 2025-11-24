import { defineSchema } from 'convex/server';
import { notificationsTable } from './notifications';
import { userSettingsTable, usersTable } from './users';
import { pendingSessions } from './sessions';
import { emailVerifications } from './emails';

const schema = defineSchema({
  users: usersTable,
  notifications: notificationsTable,
  userSettings: userSettingsTable,
  pendingSessions,
  emailVerifications,
});

export default schema;
