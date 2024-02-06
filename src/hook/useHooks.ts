import { useEffect, useState } from "react";
import { SimpleStorage, PreferenceKey, PermissionHelper } from 'lib';
import mobileAds, { MaxAdContentRating } from "react-native-google-mobile-ads";
import { Platform } from "react-native";
import { InitAds } from "utilities";

export function useFirstLaunch() {
  const [firstLaunch, setFirstLaunch] = useState(false);
  useEffect(() => {
    async function getFirstLaunchCount() {
      const launchCountStr = await SimpleStorage.getAsync(PreferenceKey.APP_LAUNCH_COUNT)
      const launchCount = launchCountStr ? parseInt(launchCountStr) : 0;
      setFirstLaunch(launchCount <= 1);
    }

    getFirstLaunchCount();
  }, []);
  return firstLaunch;
}


export function useInitAds() {
  useEffect(() => {
    InitAds();
  }, []);
}
