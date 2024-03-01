import {useEffect, useState} from 'react';
import {SimpleStorage, PreferenceKey} from 'lib';
import {AppState, AppStateStatus} from 'react-native';

export function useQuickCamera(): [boolean, (boolean) => Promise<void>] {
  const [isQuick, setQuick] = useState(false);

  const setQuickCamera = async (isOn: boolean) => {
    try {
      await SimpleStorage.save(
        PreferenceKey.QUICK_CAMERA_USED,
        isOn ? '1' : '0',
      );
      setQuick(isOn);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    async function getQuickCamera() {
      const usedStr = await SimpleStorage.getAsync(
        PreferenceKey.QUICK_CAMERA_USED,
      );
      const isUsed = usedStr ? parseInt(usedStr, 10) : 0;
      setQuick(isUsed === 1);
    }

    getQuickCamera();
  }, []);

  return [isQuick, setQuickCamera];
}

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === 'active');
    };
    const listener = AppState.addEventListener('change', onChange);
    return () => listener.remove();
  }, [setIsForeground]);

  return isForeground;
};
