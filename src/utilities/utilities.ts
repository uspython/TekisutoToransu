import {
  PermissionHelper,
  PreferenceKey,
  PreloadPreferencesList,
  SimpleStorage,
} from 'lib';
import {Platform} from 'react-native';
import mobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';
import ImageResizer from '@bam.tech/react-native-image-resizer';

export async function InitAds() {
  console.log('InitAds');
  const initAd = async () => {
    try {
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.G,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });
      await mobileAds().initialize();
      // Initialize the Ads SDK successfully.
      console.log('Ads SDK initialized successfully.');
    } catch (error) {
      console.log('Ads SDK failed to initialize.', error);
    }
  };

  if (Platform.OS === 'android') {
    await initAd();
  } else if (Platform.OS === 'ios') {
    PermissionHelper.requestATTPermission(initAd, err => {
      console.log('request ATT:' + err);
    });
  }
}

export async function checkLaunchCount(): Promise<number> {
  const countStr = await SimpleStorage.getAsync(
    PreferenceKey.APP_LAUNCH_COUNT,
    '0',
  );
  let count = countStr ? parseInt(countStr, 10) : 0;
  count = count + 1;
  SimpleStorage.saveForNow(PreferenceKey.APP_LAUNCH_COUNT, `${count}`);
  await SimpleStorage.save(PreferenceKey.APP_LAUNCH_COUNT, `${count}`);
  return count;
}

export async function loadAsyncStorage() {
  SimpleStorage.clear();
  await SimpleStorage.load(PreloadPreferencesList);
}

export async function handleResizeImage(imagePath: string) {
  const resizeResp = await ImageResizer.createResizedImage(
    imagePath,
    1280,
    1280,
    'JPEG',
    70,
    90,
    null,
    false,
    {mode: 'contain', onlyScaleDown: true},
  );

  return resizeResp.path;
}

export async function handleApiRequest(path: string) {
  console.log('handleApiRequest', path);
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(path);
    }, 3000);
  });
}
