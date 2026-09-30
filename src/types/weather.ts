export type ForecastHour = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type ForecastDay = {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  weatherCode: number;
};

export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weatherCode: number;
  hourlyForecast: ForecastHour[];
  dailyForecast: ForecastDay[];
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
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};