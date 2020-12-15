import {i18next} from '..';

const humanizeDisclaimer = (locale: string) => {
  const t = i18next.getFixedT(locale);
  const key = 'common.disclaimer.assistant_IANAD';

  return t(key);
};
export default humanizeDisclaimer;
