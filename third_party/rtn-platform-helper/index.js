import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'rtn-platform-helper' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const RtnPlatformHelperModule = isTurboModuleEnabled
  ? require('./NativeRtnPlatformHelper').default
  : NativeModules.RtnPlatformHelper;

const RtnPlatformHelper = RtnPlatformHelperModule
  ? RtnPlatformHelperModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default RtnPlatformHelper;
export function multiply(a: number, b: number): Promise<number> {
  return RtnPlatformHelper.multiply(a, b);
}
