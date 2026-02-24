const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.unstable_enablePackageExports = true;
// defaultConfig.resolver.assetExts.push('wasm');

// Add COEP and COOP headers to support SharedArrayBuffer
// defaultConfig.server.enhanceMiddleware = (middleware) => {
//   return (req, res, next) => {
//     res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
//     res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//     middleware(req, res, next);
//   };
// };

module.exports = withStorybook(defaultConfig, {
  // Set to false to remove storybook specific options
  // you can also use a env variable to set this
  enabled: true,
  // Path to your storybook config
  configPath: path.resolve(__dirname, './.storybook'),

  // Optional websockets configuration
  // Starts a websocket server on the specified port and host on metro start
  // websockets: {
  //   port: 7007,
  //   host: 'localhost',
  // },
});