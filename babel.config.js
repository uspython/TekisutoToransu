module.exports = function (api) {
  api.cache(true);

  const useRemoveConsole = [];
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.BABEL_ENV === 'production'
  ) {
    useRemoveConsole.push(['transform-remove-console', {exclude: ['info']}]);
  }

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          blacklist: null, // DEPRECATED
          whitelist: null, // DEPRECATED
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      [
        'module-resolver',
        {
          alias: {
            res: './src/res',
            model: './src/model',
            component: './src/component',
            lib: './src/lib',
            utilities: './src/utilities',
            hook: './src/hook',
            'rtn-platform-helper': './third_party/rtn-platform-helper',
          },
        },
      ],
      ['react-native-reanimated/plugin'],
      ...useRemoveConsole,
    ],
  };
};
