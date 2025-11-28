import auth from './auth.json';
import common from './common.json';
import dashboard from './dashboard.json';
import footer from './footer.json';
import landing from './landing.json';
import notifications from './notifications.json';
import settings from './settings.json';
import workspaces from './workspaces.json';
import org from './org.json';
import whiteboard from './whiteboard.json';

const en = {
  ...common,
  ...auth,
  ...footer,
  ...landing,
  ...dashboard,
  ...settings,
  ...notifications,
  ...workspaces,
  ...org,
  ...whiteboard
};

export default en;
