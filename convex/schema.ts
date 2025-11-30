import { defineSchema } from 'convex/server';
import {
  boardMembers,
  boards,
  boardShareLinks,
  userBoardFavorites,
} from './boards';
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
  boards,
  userBoardFavorites,
  boardMembers,
  boardShareLinks,
});

export default schema;
