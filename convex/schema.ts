import { defineSchema } from 'convex/server';
import { documents } from './documents';
import { emailVerifications } from './emails';
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
});

export default schema;
