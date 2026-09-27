# Weather App

I'm building this app one step at a time to learn mobile app development with React Native, Expo, and TypeScript. I already have experience building web apps, so this project is a chance to put that knowledge to work on a phone app.

## What the app does so far

The home screen shows current weather for Pune, India. It includes the temperature, conditions, feels-like temperature, humidity, wind, pressure, and a row of hourly forecast cards. The current weather now comes from the Open-Meteo weather service. The hourly cards still use sample data and will be connected later.

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
- [ ] **Day 3: Use phone location.** Ask for permission and show weather for the phone's location.
- [ ] **Day 4: Search for a city.** Let people look up weather in another place.
- [ ] **Day 5: Add forecasts.** Show real hourly and daily forecasts.
- [ ] **Day 6: Handle rough edges.** Improve the app for different weather, lost internet, and denied location access.
- [ ] **Day 7: Review and share. and Deploy** Check the app, tidy the code, update this README, and share the finished progress on GitHub.

## Project files

The screens are in `src/app`. The main weather screen is `src/app/index.tsx`, and `src/app/_layout.tsx` sets up navigation.

## Checks

Run these commands to check the code:

```bash
npm run lint
npx tsc --noEmit
```
