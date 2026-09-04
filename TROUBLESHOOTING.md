# Troubleshooting Notes

Only issues that occurred during development are recorded here.

1. TypeScript 6 rejected the global CSS side-effect import because CSS type declarations were missing. A `*.css` module declaration was added in `types/styles.d.ts`.
2. The first web export could not resolve `babel-preset-expo`. The SDK 57-compatible preset was installed directly as a development dependency.
3. Expo SQLite's web worker could not bundle its WASM file. Metro was configured with WASM asset support and the COEP/COOP headers required by the Expo SQLite SDK 57 documentation.
4. The first browser run reported that NativeWind could not manually set the color scheme while dark mode used `media`. Tailwind was changed to class-controlled dark mode and Metro was restarted with a cleared cache.
5. The iOS Simulator contained Expo Go for SDK 54. Expo installed the recommended Expo Go 57.0.9 before launching the app.
