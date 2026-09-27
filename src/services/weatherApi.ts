import { CurrentWeather, OpenMeteoResponse } from "@/types/weather";

const PUNE_COORDINATES = {
    latitude: 18.5204,
    longitude: 73.8567,
};

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchPuneWeather(): Promise<CurrentWeather> {
    const query = new URLSearchParams({
        latitude: String(PUNE_COORDINATES.latitude),
        longitude: String(PUNE_COORDINATES.longitude),
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