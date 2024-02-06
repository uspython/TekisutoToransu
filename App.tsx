/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabPage from './src/Views/HomeTabPage';
import CameraPage from './src/Views/CameraPage';
import {checkLaunchCount, loadAsyncStorage} from 'utilities'

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="HomeTab"
            component={HomeTabPage}
            options={{headerShown: false}}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'fullScreenModal'}}>
          <Stack.Screen
            name="CameraPage"
            component={CameraPage}
            options={{headerShown: false}}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
