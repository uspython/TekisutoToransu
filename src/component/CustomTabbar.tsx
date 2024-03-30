import {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SystemColor } from 'res';

// Custom Tab Icon Component
export const CustomTabIcon = ({focused, name, size, color}) => {
  const tabStyle: ViewStyle = {
    borderRadius: 20,
    width: 40,
    height: 30,
    backgroundColor: focused ? SystemColor.systemGrey4.light : 'clear', // Change the color as needed
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={tabStyle}>
      <Icons name={name} size={size} color={focused ? color : color} />
    </View>
  );
};
