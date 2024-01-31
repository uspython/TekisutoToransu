import memoizeOne from 'memoize-one';
import {TextStyle} from 'react-native';
import I18n from './i18n';

const isCustomFontFamily = memoizeOne(() => {
  console.log('[isUseFontFamily]', I18n.locale);
  if (I18n.locale.indexOf('zh') > -1 || I18n.locale.indexOf('ja') > -1) {
    return false;
  }
  return true;
});

const fontFamily = isCustomFontFamily()
  ? {
      /**
       * `Metropolis-Medium`
       */
      medium: {
        fontFamily: 'Metropolis-Medium',
      } as TextStyle,
      /**
       * `Metropolis-Regular`
       */
      regular: {
        fontFamily: 'Metropolis-Regular',
      } as TextStyle,
      /**
       * `Metropolis-Light`
       */
      light: {
        fontFamily: 'Metropolis-Light',
      } as TextStyle,
      /**
       * `Metropolis-Bold`
       */
      bold: {
        fontFamily: 'Metropolis-Bold',
      } as TextStyle,
      /**
       * `Metropolis-Black`
       */
      black: {
        fontFamily: 'Metropolis-Black',
      } as TextStyle,
    }
  : {
      /**
       * `System-Medium`
       */
      medium: {
        fontWeight: '500',
      } as TextStyle,
      /**
       * `System-Regular`
       */
      regular: {
        fontWeight: '400',
      } as TextStyle,
      /**
       * `System-Light`
       */
      light: {
        fontWeight: '300',
      } as TextStyle,
      /**
       * `System-Bold`
       */
      bold: {
        fontWeight: '700',
      } as TextStyle,
      /**
       * `System-Black`
       */
      black: {
        fontWeight: '900',
      } as TextStyle,
    };

export default fontFamily;
