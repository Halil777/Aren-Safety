const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Ensure Metro treats WASM as an asset (needed for expo-sqlite web build)
config.resolver.assetExts = [...(config.resolver.assetExts || []), 'wasm'];

// When the project is accessed via a Windows junction (e.g. `C:\sm`),
// Metro may resolve some files to the real path while watching the junction path.
// Include both roots so SHA-1 lookups work during bundling.
let realProjectRoot = null;
try {
  realProjectRoot = fs.realpathSync(projectRoot);
} catch {}

const watchFolders = new Set(config.watchFolders ?? []);
watchFolders.add(projectRoot);
if (realProjectRoot && realProjectRoot !== projectRoot) {
  watchFolders.add(realProjectRoot);
}
config.watchFolders = Array.from(watchFolders);

module.exports = config;
