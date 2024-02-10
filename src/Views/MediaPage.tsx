import {Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import React from 'react';
import {Routes} from './Routes';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PermissionHelper} from 'lib';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const SavePhoto = async ({photoTag}) => {
  await PermissionHelper.checkWithRequestPermissionWrite(async () => {
    try {
      console.log('save photo:' + photoTag);
      const i = await CameraRoll.saveAsset(photoTag, {type: 'photo'});
      console.warn('saved photo i:' + i);
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  });
};

type Props = NativeStackScreenProps<Routes, 'MediaPage'>;
const MediaPage = (prop: Props) => {
  const {route, navigation} = prop;
  const isDarkMode = useColorScheme() === 'dark';
  console.log('MediaPage is mounted ' + JSON.stringify(route.params.path));

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>MediaPage Screen</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaPage;
