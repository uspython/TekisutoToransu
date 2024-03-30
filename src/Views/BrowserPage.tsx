import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Share,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Ionicons
import {Routes} from './Routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {handleApiRequest, handleOcrResult, handleResizeImage} from 'utilities';
import RtnPlatformHelper from 'rtn-platform-helper';
import {SystemColor} from 'res';
import Clipboard from '@react-native-clipboard/clipboard';

type Props = NativeStackScreenProps<Routes, 'BrowserPage'>;
const BrowserPage: React.FC<Props> = props => {
  const {route} = props;
  const {params} = route;
  const {imagePath, isRotationNeeded } = params;
  const {MSSubscriptionKey} = RtnPlatformHelper.getConstants();

  const navigation = useNavigation();

  const [resizedImage, setResizedImage] = useState(imagePath);
  const [isShowImageHud, setShowImageHud] = useState(false);
  const [ocrText, setOcrText] = useState('');

  const webViewRef = React.useRef<WebView>(null);

  const handleBackPress = () => {
    requestAnimationFrame(() => {
      navigation.goBack();
    });
  };

  const handleClosePress = () => {
    requestAnimationFrame(() => {
      navigation.navigate('Home');
    });
  };

  const handleCopy = () => {
    // Implement functionality to copy ocrText to clipboard
    if (ocrText.length === 0) {
      ToastAndroid.showWithGravity(
        'No text to copy',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    Clipboard.setString(ocrText);
    ToastAndroid.showWithGravity(
      'Copied to clipboard',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const handleShare = async () => {
    // Implement share functionality
    if (ocrText.length === 0) {
      // No text to share
      ToastAndroid.showWithGravity(
        'No text to share',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    try {
      const result = await Share.share({
        message: ocrText,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        ToastAndroid.showWithGravity(
          'Dismissed',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleImageProcess = useCallback(async () => {
    setOcrText('');
    setShowImageHud(true);

    let resizedImagePath = null;
    try {
      resizedImagePath = await handleResizeImage(imagePath, isRotationNeeded);
      setResizedImage(resizedImagePath);
    } catch (error) {
      setShowImageHud(false);
      console.log(error);
    }

    if (resizedImagePath) {
      try {
        const resp = await handleApiRequest(resizedImagePath);
        const {text, wordsArray} = handleOcrResult(resp);
        setOcrText(text);
      } catch (error) {
        setShowImageHud(false);
        console.log(error);
      }
    }
    setShowImageHud(false);
  }, [imagePath, isRotationNeeded]);

  useEffect(() => {
    handleImageProcess();
  }, [handleImageProcess]);

  useEffect(() => {
    const script = `
      document.body.style.backgroundColor = 'beige'; // Example styling
      document.body.innerHTML = '<p style="color: #000; padding-top: 40px;font-size: 40;">${ocrText}</p>'; // Display the text with larger font size
      true; // Note: It's important to return true or some value here to avoid warnings in Android.
    `;

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(script);
    }
  }, [ocrText]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icons name="arrow-back" size={24} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
        <Icons name="done" size={24} />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
          source={{uri: 'file://' + resizedImage}}
          style={styles.image}
          resizeMode="contain"
        />
        {isShowImageHud ? (
          <View style={styles.hudContainer}>
            <ActivityIndicator
              size="large"
              color={`${SystemColor.pink.light}`}
            />
          </View>
        ) : null}
      </View>

      <WebView
        originWhitelist={['*']}
        ref={webViewRef}
        source={{html: '<html><body></body></html>'}}
        style={styles.webView}
      />

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={handleCopy}>
          <Icons name="content-copy" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Icons
            name={Platform.OS === 'ios' ? 'ios-share' : 'share'}
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleImageProcess}>
          <Icons name="restart-alt" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SystemColor.tertiarySystemBackground.light,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 15,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SystemColor.tertiarySystemBackground.light,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: '50%',
  },
  hudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'clear',
    zIndex: 10,
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
