const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Expo SQLite uses WebAssembly and SharedArrayBuffer in browsers.
config.resolver.assetExts.push("wasm");
config.server.enhanceMiddleware = (middleware) => {
  return (request, response, next) => {
    response.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    middleware(request, response, next);
  };
};

module.exports = withNativeWind(config, { input: "./global.css" });
