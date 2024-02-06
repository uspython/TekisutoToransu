import {I18n} from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

const i18n = new I18n({
  en,
  zh,
  ja,
});
i18n.enableFallback = true;
const [{languageCode}] = RNLocalize.getLocales() || [{languageCode: 'en'}];
i18n.defaultLocale = 'en';
i18n.locale = languageCode;

export * from './keys';

export default i18n;
