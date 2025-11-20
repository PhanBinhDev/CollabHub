import auth from './auth.json';
import common from './common.json';
import footer from './footer.json';

const en = {
  ...common,
  ...auth,
  ...footer,
};

console.log('English dictionary loaded:', en);

export default en;
