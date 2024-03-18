import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Ionicons
import {Routes} from './Routes';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<Routes, 'BrowserPage'>;
const BrowserPage: React.FC<Props> = props => {
  const {route} = props;
  const {params} = route;
  const {imagePath} = params;
  const ocrText = 'hello world';

  const navigation = useNavigation();

  const [resizedImage, setResizedImage] = useState(imagePath);
  const [isShowImageHud, setShowImageHud] = useState(false);

  const handleBackPress = () => {
    requestAnimationFrame(() => {
      navigation.goBack();
    });
  };

  const handleCopy = () => {
    // Implement functionality to copy ocrText to clipboard
    Alert.alert('Copy', 'Text copied to clipboard.');
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert('Share', 'Share dialog opened.');
  };

  const handleRerecognize = () => {
    // Implement re-recognize functionality
    Alert.alert('Re-recognize', 'OCR re-recognition triggered.');
  };

  useEffect(() => {
    async function handleResizeImage() {
      try {
        setShowImageHud(true);
        const response = await ImageResizer.createResizedImage(
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

        setResizedImage(response.path);
        setShowImageHud(false);
      } catch (error) {
        setShowImageHud(false);
        console.log(error);
      }
    }

    handleResizeImage();
  }, [imagePath]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icons name="arrow-back" size={24} />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {isShowImageHud ? (
          <View style={styles.hudContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : (
          <Image
            source={{uri: 'file://' + resizedImage}}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>

      <WebView
        originWhitelist={['*']}
        source={{html: `<p>${ocrText}</p>`}}
        style={styles.webView}
      />

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={handleCopy}>
          <Icons name="copy-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Icons name="share-social-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRerecognize}>
          <Icons name="refresh-outline" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '50%',
  },
  hudContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'clear',
  },
  image: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
});

export default BrowserPage;
