# Reflection

## What was most challenging about cross-platform development?

The most challenging part of cross-platform development was making storage and theming behave consistently on both web and iOS. SQLite and SecureStore are designed around native applications, so the web version needed platform-aware handling for settings while still providing the same experience. I also had to resolve a browser SQLite access-handle error and configure NativeWind to use class-based dark mode before the application behaved reliably on both platforms.
Testing the same workflow twice was important because a feature working in Chrome did not automatically prove that its touch interactions or native storage worked in the iOS Simulator.

## How did you handle the time constraint?

I handled the time constraint by building the application in small stages and testing each major feature as it was added. I first configured Expo Router, NativeWind, and storage, then implemented task creation and management, and finally tested settings, Dark Mode, and responsive behavior. Following the assignment's required project structure also helped me stay organized and avoid spending time on unrelated features.
Keeping the required features visible in a checklist made it easier to confirm that task statistics, filtering, deletion confirmation, and persistence were not overlooked during final testing.

## What would you improve with more time?

With more time, I would add automated tests for the database service and the most important user interactions. I would also improve accessibility by testing with a screen reader, adding more descriptive accessibility labels, and reviewing color contrast in both themes. A task-editing screen and optional due dates could make the app more useful, although I kept them out of this version so the project stayed within the assignment scope.

## What surprised you about the development process?

I was surprised by how much of the interface and navigation code could be shared between a desktop browser and an iPhone Simulator. Expo Router and React Native components made the three-screen structure straightforward, while NativeWind kept the visual design consistent at different screen sizes. At the same time, the project showed me that shared code does not eliminate platform differences, especially when browser storage and native secure storage use different APIs.
