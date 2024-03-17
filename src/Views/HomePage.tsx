import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import React, {type PropsWithChildren, useEffect, useCallback} from 'react';
import {
  Colors,
  Header,
  ReloadInstructions,
  DebugInstructions,
  LearnMoreLinks,
} from 'react-native/Libraries/NewAppScreen';
import {useQuickCamera} from 'hook';
import {checkLaunchCount, InitAds, loadAsyncStorage} from 'utilities';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Routes} from './Routes';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

type Props = NativeStackScreenProps<Routes, 'HomePage'>;

export default function HomePage(props: Props) {
  const {navigation} = props;
  const isDarkMode = useColorScheme() === 'dark';
  const [isQuickCamera] = useQuickCamera();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const showCamera = useCallback(() => {
    requestAnimationFrame(() => {
      navigation.navigate('CameraPage');
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
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            <Button title="Go to CameraPage" onPress={showCamera} />
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
