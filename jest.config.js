module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^react-native-network-logger$': '<rootDir>/__mocks__/react-native-network-logger.js',
    '^react-native-orientation-locker$': '<rootDir>/__mocks__/react-native-orientation-locker.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-linear-gradient|react-native-orientation-locker|react-native-safe-area-context|react-native-screens|react-native-video)/)',
  ],
};
