import { defineSchema } from 'convex/server';
import { boards } from './boards';
import { emailVerifications } from './emails';
import { notificationsTable } from './notifications';
import { pendingSessions } from './sessions';
import { userSettingsTable, usersTable } from './users';

const schema = defineSchema({
  users: usersTable,
  notifications: notificationsTable,
  userSettings: userSettingsTable,
  pendingSessions,
  emailVerifications,
  boards,
});

export default schema;
