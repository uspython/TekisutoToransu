import _ from 'lodash';
import {default as SimpleStorage} from './simple-storage';
import {Alert, Linking, Platform} from 'react-native';
import RNDeviceInfo from 'react-native-device-info';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {I18n, I18nLangKey} from 'res';

import {PreferenceKey} from './preference-keys';

const PermissionKeysWrite = () => {
  if (Platform.OS === 'ios') {
    return [PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY];
  } else if (Platform.OS === 'android' && RNDeviceInfo.getApiLevelSync() < 29) {
    return [PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE];
  } else if (
    Platform.OS === 'android' &&
    RNDeviceInfo.getApiLevelSync() >= 33
  ) {
    return [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES];
  } else {
    return [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
  }
};

const PermissionKeys = () => {
  if (Platform.OS === 'ios') {
    return [PERMISSIONS.IOS.PHOTO_LIBRARY];
  } else if (Platform.OS === 'android' && RNDeviceInfo.getApiLevelSync() < 29) {
    return [
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ];
  } else if (
    Platform.OS === 'android' &&
    RNDeviceInfo.getApiLevelSync() >= 33
  ) {
    return [
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    ];
  } else {
    return [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
  }
};

export async function requestWritePermission(
  callback: () => void,
): Promise<void> {
  const keys = PermissionKeysWrite();
  const statuses = await requestMultiple(keys);

  console.warn('[permission helper] request write permissions', statuses);

  const isValid = keys
    .map(key => statuses[key] === RESULTS.GRANTED)
    .reduce((p, c) => p && c, true);

  if (isValid) {
    callback && callback();
  }
}

export async function requestGalleryPermission(
  callback: () => void,
): Promise<void> {
  const statuses = await requestMultiple(PermissionKeys());

  console.warn('[permission helper] request permissions', statuses);

  //@ts-ignore
  const isValid = PermissionKeys()
    .map(key => statuses[key] === RESULTS.GRANTED)
    .reduce((p, c) => p && c, true);

  if (isValid) {
    callback && callback();
  }
}

export async function checkPermission(): Promise<string> {
  const statuses = await checkMultiple(PermissionKeys());

  console.warn('[permission helper] check permissions', statuses);

  //@ts-ignore
  const results = PermissionKeys().map(
    key => statuses[key] === RESULTS.GRANTED,
  );
  const isValid = results.reduce((p, c) => p && c, true);

  console.warn('[permission helper] isValid', isValid);

  if (isValid) {
    return RESULTS.GRANTED;
  } else {
    const results = PermissionKeys().map(
      key => statuses[key] === RESULTS.BLOCKED,
    );
    const isBlocked = results.find(v => !!v);

    return isBlocked ? RESULTS.BLOCKED : RESULTS.DENIED;
  }
}

export async function checkPermissionWrite(): Promise<string> {
  const keys = PermissionKeysWrite();
  const statuses = await checkMultiple(keys);

  console.warn('[permission helper] check permissions', statuses);

  //@ts-ignore
  const results = keys.map(key => statuses[key] === RESULTS.GRANTED);
  const isValid = results.reduce((p, c) => p && c, true);

  console.warn('[permission helper] isValid', isValid);

  if (isValid) {
    return RESULTS.GRANTED;
  } else {
    const results = keys.map(key => statuses[key] === RESULTS.BLOCKED);
    const isBlocked = results.find(v => !!v);

    return isBlocked ? RESULTS.BLOCKED : RESULTS.DENIED;
  }
}

export async function checkWithRequestPermissionWrite(
  callback: () => Promise<void>,
) {
  const status = await checkPermissionWrite();

  switch (status) {
    case RESULTS.DENIED: {
      requestWritePermission(callback);
      break;
    }
    case RESULTS.GRANTED: {
      callback && (await callback());
      break;
    }

    case RESULTS.UNAVAILABLE: {
      console.warn('[permission helper] unavailable');
      break;
    }
    case RESULTS.BLOCKED:
    default: {
      Alert.alert(
        I18n.t(I18nLangKey.alert_permission_deny_title),
        I18n.t(I18nLangKey.alert_permission_deny_msg),
        [
          {text: I18n.t(I18nLangKey.alert_btn_cancel)},
          {
            text: I18n.t(I18nLangKey.alert_permission_btn_go),
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
      );
      break;
    }
  }
}

export async function checkWithRequestPermissionAll(
  callback: () => Promise<void>,
) {
  const status = await checkPermission();

  switch (status) {
    case RESULTS.DENIED: {
      requestGalleryPermission(callback);
      break;
    }
    case RESULTS.GRANTED: {
      callback && (await callback());
      break;
    }

    case RESULTS.UNAVAILABLE: {
      console.warn('[permission helper] unavailable');
      break;
    }
    case RESULTS.BLOCKED:
    default: {
      Alert.alert(
        I18n.t(I18nLangKey.alert_permission_deny_title),
        I18n.t(I18nLangKey.alert_permission_deny_msg),
        [
          {text: I18n.t(I18nLangKey.alert_btn_cancel)},
          {
            text: I18n.t(I18nLangKey.alert_permission_btn_go),
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
      );
      break;
    }
  }
}

// function PermissionName(result: string): string {
//   switch (result) {
//     case RESULTS.DENIED: {
//       return 'NotDetermined';
//     }

//     case RESULTS.BLOCKED: {
//       return 'Denied';
//     }

//     case RESULTS.GRANTED: {
//       return 'Authorized';
//     }

//     case RESULTS.UNAVAILABLE: {
//       return 'Restricted';
//     }

//     default: {
//       return 'Unknown';
//     }
//   }
// }

export function requestATTPermission(
  onAuthorized?: () => void,
  onError?: (reason: any) => void,
): void {
  check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(result => {
    console.warn('AppTrackingTransparency: ' + result);

    switch (result) {
      case RESULTS.DENIED: {
        // Default or UnSettled, Should request permission here
        request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
          .then(result => {
            console.warn('[permission helper] tracking ', result);
            // logger.event('requestTracking', {
            //   trackingStatus: PermissionName(result),
            // });
            if (result === RESULTS.GRANTED) {
              //logger.event(`appTracking${PermissionName(result)}`);
              onAuthorized && onAuthorized();
            }
          })
          .catch(reason => {
            console.warn('[permission helper] tracking error ', reason);
            onError && onError(reason);
          });
        break;
      }

      case RESULTS.BLOCKED: {
        //PERMISSION Switch-Off on purpose, Request Permissions is Helpless
        break;
      }

      case RESULTS.GRANTED: {
        // Authorized
        break;
      }

      default: {
        break;
      }
    }
  });
}

export function goToSetting() {
  Linking.openSettings();
}

export function alertATTPermission(): void {
  if (Platform.OS !== 'ios') {
    return;
  }

  check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(result => {
    //console.warn("check APP_TRACKING_TRANSPARENCY: ", result);
    //logger.event('appTrackingStatus', {trackingStatus: PermissionName(result)});

    switch (result) {
      case RESULTS.BLOCKED: {
        //PERMISSION Switch-Off on purpose, Request Permissions is Helpless
        SimpleStorage.getAsync(PreferenceKey.TRACKING_ALERT_COUNT, '0').then(
          result => {
            let presentedCount = parseInt(result, 10) || 0;

            //console.warn("presentedCount: ", presentedCount);
            if (presentedCount < 1) {
              Alert.alert(
                '',
                I18n.t(I18nLangKey.tracking_subtitle),
                [
                  {
                    text: _.capitalize(I18n.t(I18nLangKey.alert_btn_later)),
                    onPress: () => void 0,
                    style: 'cancel',
                  },
                  {
                    text: _.capitalize(I18n.t(I18nLangKey.go_to_settings)),
                    onPress: goToSetting,
                  },
                ],
                {cancelable: false},
              );
              presentedCount += 1;
              SimpleStorage.save(
                PreferenceKey.TRACKING_ALERT_COUNT,
                `${presentedCount}`,
              );
            }
          },
        );
        break;
      }
      case RESULTS.DENIED: {
        // Default or UnSettled, Should request permission here
      }

      case RESULTS.GRANTED: {
        // Authorized
        break;
      }

      default: {
        break;
      }
    }
  });
}

export async function checkATTPermission() {
  if (Platform.OS !== 'ios') {
    return RESULTS.GRANTED;
  }

  const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

  return result;
}

const PermissionHelper = {
  checkATTPermission,
  alertATTPermission,
  checkWithRequestPermissionAll,
  checkWithRequestPermissionWrite,
  requestATTPermission,
  requestWritePermission,
  requestGalleryPermission,
  checkPermission,
  checkPermissionWrite,
};

export default PermissionHelper;
