import {
  InterstitialAd,
  RewardedAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import {
  ID_INTERSTITIAL_IOS,
  ID_INTERSTITIAL_ANDROID,
  ID_REWARDED_IOS,
  ID_REWARDED_ANDROID,
} from '@env';
import {Platform} from 'react-native';

class AdsHelper {
  private static instance: AdsHelper;
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;

  private constructor() {
    // 初始化插页式广告和激励式视频广告
    this.initializeAds();
  }

  public static getInstance(): AdsHelper {
    if (!AdsHelper.instance) {
      AdsHelper.instance = new AdsHelper();
    }
    return AdsHelper.instance;
  }

  private initializeAds() {
    const interstitialId =
      Platform.OS === 'android' ? ID_INTERSTITIAL_ANDROID : ID_INTERSTITIAL_IOS;
    // 初始化插页式广告
    this.interstitialAd = InterstitialAd.createForAdRequest(
      __DEV__ ? TestIds.INTERSTITIAL : interstitialId,
    );

    const rewardedId =
      Platform.OS === 'android' ? ID_REWARDED_ANDROID : ID_REWARDED_IOS;
    // 初始化激励式视频广告
    this.rewardedAd = RewardedAd.createForAdRequest(
      __DEV__ ? TestIds.REWARDED : rewardedId,
    );

    // 添加事件监听器
    // this.interstitialAd..onAdEvent((type, error) => {
    //   if (type === AdEventType.LOADED) {
    //     console.log('Interstitial ad loaded');
    //   } else if (type === AdEventType.ERROR) {
    //     console.error('Interstitial ad failed to load', error);
    //   }
    // });

    // this.rewardedAd.onAdEvent((type, error, reward) => {
    //   if (type === AdEventType.LOADED) {
    //     console.log('Rewarded ad loaded');
    //   } else if (type === AdEventType.EARNED_REWARD) {
    //     console.log('User earned reward of', reward);
    //   } else if (type === AdEventType.ERROR) {
    //     console.error('Rewarded ad failed to load', error);
    //   }
    // });
  }

  public loadInterstitial() {
    this.interstitialAd?.load();
  }

  public showInterstitial() {
    if (this.interstitialAd && this.interstitialAd.loaded) {
      this.interstitialAd.show().catch(error => {
        console.error('Failed to show interstitial ad', error);
      });
    }
  }

  public loadRewarded() {
    this.rewardedAd?.load();
  }

  public showRewarded() {
    if (this.rewardedAd && this.rewardedAd.loaded) {
      this.rewardedAd.show().catch(error => {
        console.error('Failed to show rewarded ad', error);
      });
    }
  }
}

export default AdsHelper;
