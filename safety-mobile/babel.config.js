module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Needed so Reanimated can compile worklets correctly in release builds
      "react-native-reanimated/plugin",
    ],
  };
};
