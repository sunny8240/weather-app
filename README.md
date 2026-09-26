# Weather App

A mobile weather app built with React Native, Expo, TypeScript, and Expo Router. This project is being developed incrementally as a learning-by-building project.

## Current Features

- Weather home screen for Pune, Maharashtra
- Current conditions and humidity, wind, and pressure details
- Horizontally scrolling hourly forecast
- Static sample weather data (live API integration is the next milestone)

## Run Locally

```bash
npm install
npx expo start
```

Use the Expo CLI prompt to open the app in Expo Go, an emulator, or a simulator. Android, iOS, and web scripts are also available through `npm run android`, `npm run ios`, and `npm run web`.

## Project Structure

```text
src/
   app/
      _layout.tsx
      index.tsx
```

The app uses Expo Router's file-based routing. The home screen is in `src/app/index.tsx`, with the default navigation header hidden in `src/app/_layout.tsx`.

## Development Checks

```bash
npm run lint
npx tsc --noEmit
```
