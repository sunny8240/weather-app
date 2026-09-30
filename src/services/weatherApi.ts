import { CurrentWeather, OpenMeteoResponse } from "@/types/weather";

export type Coordinates = {
    latitude: number;
    longitude: number;
};

export type GeoCityResult = {
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
};

export const PUNE_COORDINATES: Coordinates = {
    latitude: 18.5204,
    longitude: 73.8567,
};

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function fetchWeatherByCoordinates({
    latitude,
    longitude,
}: Coordinates): Promise<CurrentWeather> {
    const query = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,weather_code",
        hourly: "temperature_2m,weather_code",
        daily: "weather_code,temperature_2m_max,temperature_2m_min",
        forecast_days: "7",
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
        hourlyForecast: data.hourly.time.map((time, index) => ({
            time,
            temperature: data.hourly.temperature_2m[index],
            weatherCode: data.hourly.weather_code[index],
        })),
        dailyForecast: data.daily.time.map((date, index) => ({
            date,
            maxTemperature: data.daily.temperature_2m_max[index],
            minTemperature: data.daily.temperature_2m_min[index],
            weatherCode: data.daily.weather_code[index],
        })),
    };
}

export async function searchCitiesByName(query: string): Promise<GeoCityResult[]> {
    const trimmed = query.trim();

    if (!trimmed) {
        return [];
    }

    const searchParams = new URLSearchParams({
        name: trimmed,
        count: "5",
        language: "en",
        format: "json",
    });

    const response = await fetch(`${GEOCODING_API_URL}?${searchParams.toString()}`);

    if (!response.ok) {
        throw new Error("City search is unavailable right now.");
    }

    const data = (await response.json()) as {
        results?: {
            name: string;
            country: string;
            admin1?: string;
            latitude: number;
            longitude: number;
        }[];
    };

    return (
        data.results?.map((result) => ({
            name: result.name,
            country: result.country,
            admin1: result.admin1,
            latitude: result.latitude,
            longitude: result.longitude,
        })) ?? []
    );
}

export async function fetchPuneWeather(): Promise<CurrentWeather> {
    return fetchWeatherByCoordinates(PUNE_COORDINATES);
}