/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabPage from './src/Views/HomeTabPage';
import CameraPage from './src/Views/CameraPage';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MediaPage from './src/Views/MediaPage';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              name="HomeTab"
              component={HomeTabPage}
              options={{headerShown: false}}
            />
          </Stack.Group>
          <Stack.Group>
            <Stack.Screen
              name="CameraPage"
              component={CameraPage}
              options={{headerShown: false, presentation: 'fullScreenModal'}}
            />
            <Stack.Screen
              name="MediaPage"
              component={MediaPage}
              options={{
                headerShown: false,
                presentation: 'fullScreenModal',
                animation: 'fade',
                animationDuration: 200,
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
