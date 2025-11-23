import auth from './auth.json';
import common from './common.json';
import dashboard from './dashboard.json';
import footer from './footer.json';
import landing from './landing.json';
import settings from './settings.json'; 

const en = {
  ...common,
  ...auth,
  ...footer,
  ...landing,
  dashboard: {
    ...dashboard,
  },
  ...settings
};

export default en;
