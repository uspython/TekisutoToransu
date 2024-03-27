import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Ionicons
import {Routes} from './Routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {handleApiRequest, handleResizeImage} from 'utilities';

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
    Alert.alert('Copy', 'Text copied to clipboard.' + MSSubscriptionKey);
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
    async function handleImageProcess() {
      setShowImageHud(true);

      let resizedImagePath = null;
      try {
        resizedImagePath = await handleResizeImage(imagePath);
        setResizedImage(resizedImagePath);
      } catch (error) {
        setShowImageHud(false);
        console.log(error);
      }

      if (resizedImagePath) {
        try {
          await handleApiRequest(resizedImagePath);
        } catch (error) {
          setShowImageHud(false);
          console.log(error);
        }
      }
      setShowImageHud(false);
    }

    handleImageProcess();
  }, [imagePath]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icons name="arrow-back" size={24} />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
          source={{uri: 'file://' + resizedImage}}
          style={styles.image}
          resizeMode="contain"
        />
        {isShowImageHud ? (
          <View style={styles.hudContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : null}
      </View>

      <WebView
        originWhitelist={['*']}
        source={{html: `<p>${ocrText}</p>`}}
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
        <TouchableOpacity onPress={handleRerecognize}>
          <Icons name="restart-alt" size={24} />
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
