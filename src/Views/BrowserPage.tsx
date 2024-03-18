import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Ionicons

interface BrowserPageProps {
  imagePath: string;
  ocrText: string; // This prop is expected to be the text obtained from the OCR service
}

const BrowserPage: React.FC<BrowserPageProps> = ({ imagePath, ocrText }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCopy = () => {
    // Implement functionality to copy ocrText to clipboard
    Alert.alert("Copy", "Text copied to clipboard.");
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert("Share", "Share dialog opened.");
  };

  const handleRerecognize = () => {
    // Implement re-recognize functionality
    Alert.alert("Re-recognize", "OCR re-recognition triggered.");
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-back" size={24} />
      </TouchableOpacity>

      <Image source={{ uri: imagePath }} style={styles.image} resizeMode="contain" />

      <WebView
        originWhitelist={['*']}
        source={{ html: `<p>${ocrText}</p>` }}
        style={styles.webView}
      />

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={handleCopy}>
          <Icon name="copy-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Icon name="share-social-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRerecognize}>
          <Icon name="refresh-outline" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '50%', // Adjust according to your layout needs
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