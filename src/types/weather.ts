export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weatherCode: number;
};

export type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    surface_pressure: number;
    weather_code: number;
  };
};