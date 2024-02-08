import { useEffect, useState } from "react";
import { SimpleStorage, PreferenceKey, PermissionHelper } from 'lib';

export function useQuickCamera(): [boolean, (boolean) => Promise<void>] {
  const [isQuick, setQuick] = useState(false);

  const setQuickCamera = async (isOn: boolean) => {
    try {
      await SimpleStorage.save(PreferenceKey.QUICK_CAMERA_USED, isOn ? '1' : '0');
      setQuick(isOn);
    } catch (e) {
      console.warn(e);
    }
  }


  useEffect(() => {
    async function getQuickCamera() {
      const usedStr = await SimpleStorage.getAsync(PreferenceKey.QUICK_CAMERA_USED)
      const isUsed = usedStr ? parseInt(usedStr) : 0;
      setQuick(isUsed === 1);
    }

    getQuickCamera();
  }, []);


  return [isQuick, setQuickCamera];
}

