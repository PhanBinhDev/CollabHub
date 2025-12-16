import auth from './auth.json';
import common from './common.json';
import dashboard from './dashboard.json';
import documents from './documents.json';
import footer from './footer.json';
import landing from './landing.json';
import notifications from './notifications.json';
import onboarding from './onboarding.json';
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
  ...onboarding,
  ...documents,
};

export default vi;
