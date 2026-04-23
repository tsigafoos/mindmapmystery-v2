# Mind Map Mystery — Mobile

Expo SDK 55 / React Native 0.83 / React Three Fiber 9.6

## Requirements

- Node.js 20.x+
- iOS 15.1+ (for iOS) / Android 7.0+ (API 24+)
- Expo Go app (latest version from App Store / Play Store)

## Setup

```bash
npm install
npx expo start
```

## Running

**With Expo Go (recommended for development):**
- Scan the QR code shown in terminal with your device's camera (iOS) or Expo Go app (Android)

**With development build:**
- iOS: `npx expo run:ios`
- Android: `npx expo run:android`
- Web: `npx expo start --web`

## Tech Stack

- Expo SDK 55.0.14 (New Architecture)
- React Native 0.83
- React 19.2
- @react-three/fiber 9.6.0
- @react-three/drei 10.0.0
- Three.js 0.175.0
- d3-force 3.0.0

## Features

- 3D force-directed graph with React Three Fiber
- Touch-based node interaction
- Same game logic as web version
- Mobile-optimized UI
- Physics simulation with d3-force
