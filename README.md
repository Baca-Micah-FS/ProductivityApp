# Productivity App

A cross-platform task manager created with Expo, TypeScript, Expo Router, NativeWind, SQLite, and SecureStore for CDA Module 1 Assignment 1.8.

## Features

- Create tasks with a title, description, and High, Medium, or Low priority
- Mark tasks complete or incomplete
- Delete tasks after confirmation
- Search tasks and filter by completion status
- View total, completed, and remaining task statistics
- Save a user name and theme preference
- Toggle a persistent light or dark theme
- Responsive layouts for iOS and web

## Setup

Requirements: Node.js 22 or newer, npm, and Xcode with an iOS Simulator for iOS testing.

```bash
npm install
npm start
```

From the Expo terminal, press `w` for web or `i` for the iOS Simulator. You can also run a platform directly:

```bash
npm run web
npm run ios
```

## Testing

The application was tested on:

- Web using a desktop browser
- iOS using the iPhone Simulator and Expo Go

Test task creation, priority colors, completion toggling, delete confirmation, search, completion filters, statistics, settings persistence, and Dark Mode on both platforms.

## Storage

Tasks are stored in an Expo SQLite database. On native platforms, the user name and theme are stored with Expo SecureStore. Because SecureStore is unavailable on web, web settings use the browser's local storage as a platform-aware fallback.

## Known issues

No known issues after TypeScript checking, Expo Doctor, production web export, and interaction testing on web and the iOS Simulator.
