import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsPage from './SettingsPage';
import HomePage from './HomePage';
import Icons from 'react-native-vector-icons/MaterialIcons';
import type {RouteProp, ParamListBase} from '@react-navigation/native';
import HistoryPage from './HistoryPage';

const Tab = createBottomTabNavigator();

function tabBarIcon(route: RouteProp<ParamListBase, string>) {
  return (tab: {focused: any; color: any; size: any}): React.JSX.Element => {
    const {focused, color, size} = tab;
    let iconName = 'scan';

    if (route.name === 'Home') {
      iconName = focused ? 'crop-free' : 'crop-free';
    } else if (route.name === 'Settings') {
      iconName = focused ? 'manage-accounts' : 'manage-accounts';
    } else if (route.name === 'History') {
      iconName = focused? 'history' : 'history';
    }
    //<MaterialIcons name="home" color={color} size={size} />
    // You can return any component that you like here!
    return <Icons name={iconName} size={size} color={color} />;
  };
}

export default function HomeTabPage() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: tabBarIcon(route),
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="History" component={HistoryPage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
}
