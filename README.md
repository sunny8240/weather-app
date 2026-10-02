# Weather App

I'm building this app one step at a time to learn mobile app development with React Native, Expo, and TypeScript. I already have experience building web apps, so this project is a chance to put that knowledge to work on a phone app.

## What the app does

The home screen shows current weather for the device location, with Pune as a fallback. It includes the temperature, conditions, feels-like temperature, humidity, wind, pressure, real hourly forecast cards, and a real seven-day forecast.

The app also supports:

- searching for a city and loading its weather
- location permission handling with a Pune fallback
- loading states with an animated progress treatment
- offline and API failure states with a Lottie animation
- retrying after a failed weather request

## Run the app

Install the project packages, then start Expo:

```bash
npm install
npx expo start
```

Follow the instructions in the terminal to open the app on a phone or simulator. You can also run `npm run android`, `npm run ios`, or `npm run web`.

## Seven-day challenge

- [x] **Day 1: Build the screen.** Set up the app and make the first weather screen with sample data.
- [x] **Day 2: Get real weather.** Connect Open-Meteo and add loading, error, and retry states.
- [x] **Day 3: Use phone location.** Ask for permission, use the device coordinates, and show the current place name when available.
- [x] **Day 4: Search for a city.** Let people look up a city and see the weather for that place.
- [x] **Day 5: Add forecasts.** Show real hourly and daily forecasts.
- [x] **Day 6: Handle rough edges.** Improve the app for different weather, lost internet, and denied location access.
- [x] **Day 7: Review and share.** Review the app, tidy the code, update this README, and push the finished progress to GitHub.

## Project files

The screens are in `src/app`. The main weather screen is `src/app/index.tsx`, and `src/app/_layout.tsx` sets up navigation. Weather and city search requests live in `src/services/weatherApi.ts`, and shared response types live in `src/types/weather.ts`.

The app uses [Open-Meteo](https://open-meteo.com/) for weather and geocoding data. No API key is required.

## Checks

Run these commands to check the code:

```bash
npm run lint
npx tsc --noEmit
```

## Share the app

The project is available on GitHub:

https://github.com/sunny8240/weather-app

To open the project locally:

```bash
npm install
npx expo start
```
