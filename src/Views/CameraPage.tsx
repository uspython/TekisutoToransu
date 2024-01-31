import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useAppState} from '@react-native-community/hooks';
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

const SavePhoto = async ({photoData}) => {
  const checkAndSavePhoto = async () => {
    let status;

    // Checking and requesting permissions based on platform and OS version
    if (Platform.OS === 'ios') {
      // Assuming you want add-only access for iOS
      status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
    } else {
      // Differentiating between Android versions
      const permission =
        Number(Platform.Version) >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      status = await check(permission);
      if (status !== RESULTS.GRANTED) {
        status = await request(permission);
      }
    }

    // If permission is granted, save the photo
    if (status === RESULTS.GRANTED) {
      try {
        await CameraRoll.saveToCameraRoll;
      } catch (error) {
        console.error('Error saving photo:', error);
      }
    } else {
      console.error('Error saving photo: No Permissions Granted');
    }
  };

  await checkAndSavePhoto();
};

export default function CameraPage(props: {navigation: any}) {
  const {navigation} = props;

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

  if (device == null || !hasPermission) {
    return <Text>No Camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />
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
    backgroundColor: 'white',
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
