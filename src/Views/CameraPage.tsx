import {useIsFocused} from '@react-navigation/core';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StatusBarBlurBackground} from 'component';
import {useIsForeground} from 'hook';
import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
  PreferenceKey,
  SAFE_AREA_PADDING,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SimpleStorage,
} from 'lib';
import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  GestureResponderEvent,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Reanimated from 'react-native-reanimated';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {InitAds} from 'utilities';
import type {Routes} from './Routes';
import {I18n, I18nLangKey} from 'res';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

type Props = NativeStackScreenProps<Routes, 'CameraPage'>;
export default function CameraPage(props: Props): React.ReactElement {
  const {navigation} = props;
  const camera = useRef<Camera>(null);

  const [isShowCamera, setShowCamera] = useState(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);

  const {hasPermission, requestPermission} = useCameraPermission();

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false);

  // camera device settings
  const device = useCameraDevice('back');

  const screenAspectRatio = 4 / 3;
  const format = useCameraFormat(device, [
    {photoAspectRatio: screenAspectRatio},
    {photoResolution: {width: 1024, height: 768}},
  ]);
  // format.photoHeight = 1024;
  // format.photoWidth = 768;

  const supportsFlash = device?.hasFlash ?? false;
  const canToggleNightMode = device?.supportsLowLightBoost ?? false;

  //#region Callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);
  //#endregion

  //#region Tap Gesture
  const onFocusTap = useCallback(
    ({nativeEvent: event}: GestureResponderEvent) => {
      if (!device?.supportsFocus) {
        return;
      }
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      });
    },
    [device?.supportsFocus],
  );
  //#endregion

  const takePic = useCallback(async () => {
    const photoFile = await camera.current?.takePhoto({
      qualityPrioritization: 'speed',
      flash: flash,
      enableShutterSound: false,
    });
    if (photoFile) {
      //await SavePhoto({photoTag: `${photoFile.path}`});
      navigation.push('MediaPage', {
        path: photoFile.path,
      });
    } else {
      console.error('No photo taken');
    }
  }, [flash, navigation]);

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo)`
        : undefined;
    console.log(`Camera: ${device?.name} | Format: ${f}`);
  }, [device?.name, format]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', _ => {
      // Launch at the first time
      // Show ATT When Close
      const countStr = SimpleStorage.getSync(PreferenceKey.APP_LAUNCH_COUNT);
      const count = countStr ? parseInt(countStr, 10) : 0;
      if (count <= 1) {
        InitAds().then(() => {
          console.log('Ads initialized from Camera Page');
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    async function checkCameraPermission() {
      if (hasPermission) {
        setShowCamera(true);
        return;
      }

      console.log('Requesting camera permission...');
      const isGranted = await requestPermission();
      if (isGranted) {
        setShowCamera(true);
        return;
      }

      Alert.alert(
        I18n.t(I18nLangKey.alert_permission_deny_title),
        I18n.t(I18nLangKey.alert_permission_deny_msg),
        [
          {text: I18n.t(I18nLangKey.alert_btn_cancel)},
          {
            text: I18n.t(I18nLangKey.alert_permission_btn_go),
            onPress: async () => {
              await Linking.openSettings();
            },
          },
        ],
      );
    }
    // 检查相机权限
    checkCameraPermission();
  }, [hasPermission, requestPermission]);

  if (!isShowCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Pending Permission</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {device != null && (
        <Reanimated.View
          onTouchEnd={onFocusTap}
          style={StyleSheet.absoluteFill}>
          <ReanimatedCamera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            ref={camera}
            onInitialized={onInitialized}
            onError={onError}
            onStarted={() => 'Camera started!'}
            onStopped={() => 'Camera stopped!'}
            format={format}
            photoHdr={format?.supportsPhotoHdr}
            lowLightBoost={device.supportsLowLightBoost && enableNightMode}
            enableZoomGesture={true}
            exposure={0}
            orientation="portrait"
            photo={true}
          />
        </Reanimated.View>
      )}
      <TouchableOpacity
        disabled={!isCameraInitialized}
        style={styles.captureButton}
        onPress={takePic}>
        <Icons name={'radio-button-on'} color="white" size={96} />
      </TouchableOpacity>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.buttonC}
          onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text>Gallery</Text>
        </TouchableOpacity>
      </View>

      <StatusBarBlurBackground />

      <View style={styles.rightButtonRow}>
        {supportsFlash && (
          <TouchableOpacity style={styles.buttonC} onPress={onFlashPressed}>
            <Icons
              name={flash === 'on' ? 'flash-on' : 'flash-off'}
              color="white"
              size={24}
            />
          </TouchableOpacity>
        )}
        {canToggleNightMode && (
          <TouchableOpacity
            style={styles.buttonC}
            onPress={() => setEnableNightMode(!enableNightMode)}>
            <Icons
              name={enableNightMode ? 'mode-night' : 'sun'}
              color="white"
              size={24}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
  },
  buttonC: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
  gridLine: {
    position: 'absolute',
    borderColor: 'white',
    borderWidth: 1,
    width: '100%',
  },
});
