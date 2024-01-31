'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';

class SimpleStorage {
  private static _snapCache: Map<string, string> = null;

  static clear() {
    SimpleStorage._snapCache = new Map();
  }

  static async load(keys: string[]): Promise<void> {
    await Promise.all(
      keys.map(async key => {
        await SimpleStorage.getAsync(key);
      }),
    );
  }

  static getSync(key: string, defaultValue: string = null): string {
    if (SimpleStorage._snapCache.has(key)) {
      return SimpleStorage._snapCache.get(key) || defaultValue;
    } else {
      return defaultValue;
    }
  }

  static async getAsync(
    key: string,
    defaultValue: string = null,
  ): Promise<string> {
    let value = defaultValue;

    try {
      value = await AsyncStorage.getItem(key);
    } catch (e) {
      __DEV__ && console.warn(`[SimpleStorage] getAsync, key:${key} error`);
      value = defaultValue;
    } finally {
      SimpleStorage._snapCache.set(key, value);
    }
    return value;
  }

  static async save(key: string, value: string): Promise<void> {
    SimpleStorage._snapCache.set(key, value);
    await AsyncStorage.setItem(key, value);
  }

  static async saveForNow(key: string, value: string) {
    SimpleStorage._snapCache.set(key, value);
  }

  static async saveMultiple(pairs: [string, string][]): Promise<void> {
    pairs.forEach(pair => {
      const [key, value] = pair;

      SimpleStorage._snapCache.set(key, value);
    });
    await AsyncStorage.multiSet(pairs);
  }

  static async delete(key: string): Promise<void> {
    try {
      SimpleStorage._snapCache && SimpleStorage._snapCache.delete(key);
      await AsyncStorage.removeItem(key);
    } catch (e) {
      __DEV__ && console.warn(`[SimpleStorage] delete key:${key} error`);
    }
  }
}

export default SimpleStorage;
