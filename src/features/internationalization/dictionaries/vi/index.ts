import auth from './auth.json';
import common from './common.json';
import dashboard from './dashboard.json';
import footer from './footer.json';
import landing from './landing.json';
import notifications from './notifications.json';
import org from './org.json';
import settings from './settings.json';
import whiteboard from './whiteboard.json';
import workspaces from './workspaces.json';

const vi = {
  ...common,
  ...auth,
  ...footer,
  ...landing,
  ...dashboard,
  ...settings,
  ...notifications,
  ...workspaces,
  ...org,
  ...whiteboard,
};

export default vi;
