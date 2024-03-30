import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import React, {type PropsWithChildren, useEffect, useCallback} from 'react';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useQuickCamera} from 'hook';
import {checkLaunchCount, InitAds, loadAsyncStorage} from 'utilities';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Routes} from './Routes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SystemColor} from 'res';
import type {ImageOrVideo} from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-crop-picker';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const screenWidth = Dimensions.get('window').width;
type Props = NativeStackScreenProps<Routes, 'HomePage'>;

export default function HomePage(props: Props) {
  const {navigation} = props;
  const isDarkMode = useColorScheme() === 'dark';
  const [isQuickCamera] = useQuickCamera();

  const showCamera = useCallback(() => {
    requestAnimationFrame(() => {
      navigation.navigate('CameraPage');
    });
  }, [navigation]);

  const handleChoosePhoto = useCallback(async () => {
    requestAnimationFrame(async () => {
      try {
        const result: ImageOrVideo = await ImagePicker.openPicker({
          width: 960,
          height: 1280,
          cropping: true,
          freeStyleCropEnabled: true,
          includeBase64: false,
          includeExif: false,
          forceJpg: true,
        });
        console.log('[ImagePicker]: ' + JSON.stringify(result));
        if (result.path) {
          navigation.push('BrowserPage', {
            imagePath: result.path,
            isRotationNeeded: false,
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
  }, [navigation]);

  useEffect(() => {
    if (isQuickCamera) {
      navigation.navigate('CameraPage');
    }
  }, [isQuickCamera, navigation]);

  useEffect(() => {
    async function checkAppInitial() {
      await loadAsyncStorage();
      let count = await checkLaunchCount();
      if (count > 1) {
        await InitAds();
      }
    }

    checkAppInitial();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.insetGrouped]}
          onPress={showCamera}>
          <Icons
            name="photo-camera"
            size={100}
            color={`${SystemColor.secondaryLabel.light}`}
          />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.insetGrouped]}
          onPress={handleChoosePhoto}>
          <Icons
            name="photo-library"
            size={100}
            color={`${SystemColor.secondaryLabel.light}`}
          />
          <Text style={styles.buttonText}>Camera Roll</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#EFEFF4',
    borderRadius: 10,
    width: screenWidth - 40, // Subtracting the horizontal paddings
  },
  insetGrouped: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: '500',
    color: SystemColor.secondaryLabel.light,
  },
});
