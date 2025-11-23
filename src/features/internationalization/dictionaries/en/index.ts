import auth from './auth.json';
import common from './common.json';
import dashboard from './dashboard.json';
import footer from './footer.json';
import landing from './landing.json';
import notifications from './notifications.json';
import settings from './settings.json';
import workspaces from './workspaces.json';

const en = {
  ...common,
  ...auth,
  ...footer,
  ...landing,
  dashboard: {
    ...dashboard,
  },
  ...settings,
  ...notifications,
  ...workspaces,
};

export default en;
