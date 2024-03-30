import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsPage from './SettingsPage';
import HomePage from './HomePage';
import type {RouteProp, ParamListBase} from '@react-navigation/native';
import HistoryPage from './HistoryPage';
import {CustomTabIcon} from 'component';
import {SystemColor} from 'res';

const Tab = createBottomTabNavigator();

function tabBarIcon(route: RouteProp<ParamListBase, string>) {
  return (tab: {focused: any; color: any; size: any}): React.JSX.Element => {
    const {focused, color, size} = tab;
    let iconName = 'scan';

    if (route.name === 'Home') {
      iconName = focused ? 'screenshot' : 'screenshot';
    } else if (route.name === 'Settings') {
      iconName = focused ? 'manage-accounts' : 'manage-accounts';
    } else if (route.name === 'History') {
      iconName = focused ? 'history' : 'history';
    }
    // You can return any component that you like here!
    return (
      <CustomTabIcon
        name={iconName}
        size={size}
        focused={focused}
        color={color}
      />
    );
  };
}

export default function HomeTabPage() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: tabBarIcon(route),
        tabBarActiveTintColor: SystemColor.label.light,
        tabBarInactiveTintColor: SystemColor.label.light,
        tabBarShowLabel: true,
      })}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{headerShown: true}}
      />
      {/* <Tab.Screen name="History" component={HistoryPage} /> */}
      <Tab.Screen
        name="Settings"
        options={{headerShown: true}}
        component={SettingsPage}
      />
    </Tab.Navigator>
  );
}
