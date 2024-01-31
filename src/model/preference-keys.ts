'use strict';

export enum PreferenceKey {
  /**
   *  首次安装时间
   */
  APP_INSTALL_TIME = 'app.install.time',
  /**
   *  首次安装版本
   */
  APP_INSTALL_VERSION = 'app.install.version',
  /**
   *  首次安装 Build
   */
  APP_INSTALL_BUILD = 'app.install.build',
  /**
   *  最后更新版本
   */
  APP_UPDATE_VERSION = 'app.current.version',
  /**
   *  本次启动时间
   */
  APP_LAUNCH_TIME = 'app.launch.time',
  /**
   *  累计启动次数
   */
  APP_LAUNCH_COUNT = 'app.launch.count',
  /**
   * 累计打开天数
   */
  APP_ACCUMULATED_DAYS = 'app.accumulated.days',
  /**
   * 连续打开天数
   */
  APP_CONTINUOUS_DAYS = 'app.coutinuous.days',

  /**
   *  用户服务资格状态
   */
  USER_ENTITLEMENTS_STATUS = 'user.entitlements',
  /**
   *  用户noneConsumedItems状态
   */
  USER_NONE_CONSUMED_ITEMS = 'user.noneConsumedItems',
  /**
   * 用户的tab_badge信息
   */
  USER_TAB_BADGES = 'user.tab.badges',
  /**
   * 用户的tab_badge信息
   */
  USER_TAB_BADGES_VERSION = 'user.tab.badges.version',

  /**
   *  资源清单 ETag
   */
  RES_MANIFEST_ETAG = 'res.manifest.etag',

  /**
   *  设备是否支持震动
   */
  DEVICE_VIBRATION_SUPPORT = 'setting.vibration.support',

  /**
   *  设置是否开启震动
   */
  SETTING_VIBRATION_ENABLED = 'setting.vibration.enabled',
  /**
   * 使用天数
   */
  USER_USE_DATE_COUNT = 'user.use.date.count',

  /**
   * 用户启动天数
   */
  USER_APP_LAUNCH_DAY = 'user.app.launch.day',

  /**
   *  Shop Modal Showing Count
   */
  ALICE_MODAL_SHOW_COUNT = 'alice.modal.show.count',

  /**
   * Tracking Alert presented count
   */
  TRACKING_ALERT_COUNT = 'tracking.alert.count',

  /**
   * Tracking 弹窗是否显示过
   */
  TRACKING_MODAL_HIDDEN = 'tracking.modal.hidden',
}

export const PreloadPreferencesList = Object.keys(PreferenceKey).map(
  k => PreferenceKey[k],
);
