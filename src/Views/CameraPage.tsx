import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useAppState} from '@react-native-community/hooks';
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {PermissionHelper, PreferenceKey, SimpleStorage} from 'lib';
import { useQuickCamera } from 'hook';
import { InitAds } from 'utilities';

const SavePhoto = async ({photoTag}) => {
  await PermissionHelper.checkWithRequestPermissionWrite(async () => {
    try {
      const i = await CameraRoll.saveToCameraRoll(photoTag);
      console.warn('saved photo i:' + i);
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  });
};

export default function CameraPage(props: {navigation: any}) {
  const {navigation} = props;

  const isFirstLaunch = useQuickCamera();
  const camera = useRef<Camera>(null);
  const [showGrid, setShowGrid] = useState(false);

  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === 'active';

  const {hasPermission, requestPermission} = useCameraPermission();
  const isDarkMode = useColorScheme() === 'dark';

  const device = useCameraDevice('back');

  const toggleGrid = useCallback(() => {
    setShowGrid(!showGrid);
  }, [showGrid]);

  const takePic = useCallback(async () => {
    const photo = await camera.current?.takePhoto({
      qualityPrioritization: 'speed',
      flash: 'off',
      enableShutterSound: false,
    });
    if (photo) {
      await SavePhoto({photoTag: photo});
    } else {
      console.error('No photo taken');
    }
  }, []);

  const renderGrid = () => {
    if (!showGrid) {
      return null;
    }
    return (
      <View style={styles.gridContainer}>
        {Array.from({length: 2}).map((_, index) => (
          <React.Fragment key={`line-${index}`}>
            <View
              style={[
                styles.gridLine,
                {top: `${(index + 1) * 33.33}%`}, // for horizontal lines
              ]}
            />
            <View
              style={[
                styles.gridLine,
                {left: `${(index + 1) * 33.33}%`}, // for vertical lines
                {height: '100%', width: 1}, // Adjust the dimensions for vertical lines
              ]}
            />
          </React.Fragment>
        ))}
      </View>
    );
  };

  useEffect(() => {
    async function grantPermission() {
      await requestPermission();
    }

    grantPermission();

    return () => {};
  }, [requestPermission]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Launch at the first time
      // Show ATT When Close
      const countStr = SimpleStorage.getSync(PreferenceKey.APP_LAUNCH_COUNT);
      const count = countStr? parseInt(countStr, 10) : 0;
      if(count <= 1) {
        InitAds().then(() => {
          console.log('Ads initialized from Camera Page');
        });
      }
    });

    return unsubscribe;
  }, [navigation, isFirstLaunch]);

  if (device == null || !hasPermission) {
    return <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
<Text>No Camera</Text>
<TouchableOpacity
    style={styles.button}
    onPress={() => navigation.goBack()}>
    <Text>Back</Text>
  </TouchableOpacity>
    </View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      /> */}
      {renderGrid()}
      {/* Top Buttons */}
      <View style={styles.topButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* Flash functionality */
          }}>
          <Text>Flash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleGrid}>
          <Text>Grid</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePic}>
          <Text>Shot</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text>Gallery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  button: {
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
