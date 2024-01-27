import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

export default function CameraPage(props) {
  const {navigation} = props;
  const isDarkMode = useColorScheme() === 'dark';
  const {hasPermission, requestPermission} = useCameraPermission();

  const device = useCameraDevice('back');

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
    <SafeAreaView style={{flex: 1}}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    </SafeAreaView>
  );
}
