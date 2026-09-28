import { CurrentWeather, OpenMeteoResponse } from "@/types/weather";

export type Coordinates = {
    latitude: number;
    longitude: number;
};

export const PUNE_COORDINATES: Coordinates = {
    latitude: 18.5204,
    longitude: 73.8567,
};

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeatherByCoordinates({
    latitude,
    longitude,
}: Coordinates): Promise<CurrentWeather> {
    const query = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,weather_code",
        timezone: "auto",
    });

    const response = await fetch(`${WEATHER_API_URL}?${query.toString()}`);

    if (!response.ok) {
        throw new Error("Weather service is unavailable right now.");
    }

    const data = (await response.json()) as OpenMeteoResponse;

    return {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        pressure: data.current.surface_pressure,
        weatherCode: data.current.weather_code,
    };
}

export async function fetchPuneWeather(): Promise<CurrentWeather> {
    return fetchWeatherByCoordinates(PUNE_COORDINATES);
}