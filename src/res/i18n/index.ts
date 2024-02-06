import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';
export * from './keys';
I18n.fallbacks = true;
I18n.translations = {
  en,
  zh,
  ja,
};
const [{languageCode}] = RNLocalize.getLocales() || [{languageCode: 'en'}];

I18n.locale = languageCode;
export default I18n;
