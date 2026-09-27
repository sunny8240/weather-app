import { fetchPuneWeather } from "@/services/weatherApi";
import { CurrentWeather } from "@/types/weather";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const hourlyForecast = [
  { time: "Now", temp: 28, icon: "sunny-outline" },
  { time: "10 AM", temp: 29, icon: "sunny-outline" },
  { time: "11 AM", temp: 30, icon: "partly-sunny-outline" },
  { time: "12 PM", temp: 31, icon: "partly-sunny-outline" },
  { time: "1 PM", temp: 32, icon: "sunny-outline" },
  { time: "2 PM", temp: 32, icon: "sunny-outline" },
];

type WeatherIconName = keyof typeof Ionicons.glyphMap;

function getWeatherCondition(weatherCode: number): string {
  if (weatherCode === 0) return "Clear";
  if ([1, 2, 3].includes(weatherCode)) return "Cloudy";
  if ([45, 48].includes(weatherCode)) return "Foggy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "Snowy";
  if ([95, 96, 99].includes(weatherCode)) return "Stormy";
  return "Unknown";
}

function getWeatherIcon(weatherCode: number): WeatherIconName {
  if (weatherCode === 0) return "sunny-outline";
  if ([95, 96, 99].includes(weatherCode)) return "thunderstorm-outline";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "rainy-outline";
  return "cloudy-outline";
}

export default function HomeScreen() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadWeather() {
    setIsLoading(true);
    setError(null);

    try {
      setWeather(await fetchPuneWeather());
    } catch {
      setError("We couldn't load the weather. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPuneWeather()
      .then(setWeather)
      .catch(() => setError("We couldn't load the weather. Please try again."))
      .finally(() => setIsLoading(false));
  }, []);

  const condition = weather ? getWeatherCondition(weather.weatherCode) : "";

  return (
    <SafeAreaView className="flex-1 bg-[#eef3f0]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between border-b border-[#d7e1dc] pb-5">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={19} color="#52796c" />
            <View className="ml-2.5">
              <Text className="text-[11px] font-semibold uppercase text-[#52796c]">Local forecast</Text>
              <Text className="mt-0.5 text-lg font-semibold text-[#1b2b26]">Pune, Maharashtra</Text>
            </View>
          </View>
          <View className="flex-row items-center rounded-full bg-[#dcebe3] px-3 py-1.5">
            <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#4f806e]" />
            <Text className="text-[10px] font-semibold uppercase text-[#365f51]">
              {isLoading ? "Updating" : error ? "Offline" : "Live"}
            </Text>
          </View>
        </View>

        <View className="border-b border-[#d7e1dc] py-8">
          <Text className="text-[11px] font-semibold uppercase text-[#789087]">Current conditions</Text>
          {error ? (
            <View className="mt-8 min-h-[150px] justify-center">
              <Text className="text-base leading-6 text-[#812f28]">{error}</Text>
              <Pressable className="mt-4 self-start border-b border-[#365f51] pb-1" onPress={loadWeather}>
                <Text className="text-sm font-semibold text-[#365f51]">Try again</Text>
              </Pressable>
            </View>
          ) : isLoading ? (
            <View className="mt-8 min-h-[150px] justify-center">
              <Text className="text-base text-[#708078]">Getting the latest weather...</Text>
            </View>
          ) : weather ? (
            <View className="mt-5 flex-row items-center justify-between">
              <View>
                <Text className="text-[84px] leading-[92px] font-light text-[#1b2b26]">
                  {Math.round(weather.temperature)}°
                </Text>
                <Text className="mt-1 text-xl font-medium text-[#30483e]">{condition}</Text>
                <Text className="mt-1.5 text-sm text-[#708078]">
                  Feels like {Math.round(weather.apparentTemperature)}°
                </Text>
              </View>
              <Ionicons name={getWeatherIcon(weather.weatherCode)} size={68} color="#d28a35" />
            </View>
          ) : null}
        </View>

        <View className="border-b border-[#d7e1dc] py-6">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-[11px] font-semibold uppercase text-[#789087]">Weather details</Text>
            <Text className="text-xs text-[#789087]">NOW</Text>
          </View>
          {weather ? (
            <View className="flex-row">
              <WeatherDetail
                icon={<Ionicons name="water-outline" size={18} color="#52796c" />}
                label="Humidity"
                value={`${weather.humidity}%`}
              />
              <WeatherDetail
                icon={<Feather name="wind" size={18} color="#52796c" />}
                label="Wind"
                value={`${Math.round(weather.windSpeed)} km/h`}
              />
              <WeatherDetail
                icon={<Ionicons name="speedometer-outline" size={18} color="#52796c" />}
                label="Pressure"
                value={`${Math.round(weather.pressure)} hPa`}
              />
            </View>
          ) : (
            <Text className="text-sm text-[#708078]">Details will appear when weather loads.</Text>
          )}
        </View>

        <View className="flex-row items-end justify-between pb-4 pt-7">
          <Text className="text-xl font-semibold text-[#1b2b26]">Hourly forecast</Text>
          <Text className="text-[10px] font-semibold uppercase text-[#789087]">Today</Text>
        </View>
        <FlatList
          data={hourlyForecast}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.time}
          contentContainerStyle={{ paddingRight: 20 }}
          renderItem={({ item }) => (
            <View className={`mr-2.5 min-h-[108px] w-[72px] items-center justify-center rounded-md border px-2 py-3 ${item.time === "Now" ? "border-[#365f51] bg-[#365f51]" : "border-[#d7e1dc] bg-white"}`}>
              <Text className={`text-xs ${item.time === "Now" ? "font-semibold text-white" : "text-[#708078]"}`}>
                {item.time}
              </Text>
              <Ionicons
                name={item.icon as WeatherIconName}
                size={24}
                color={item.time === "Now" ? "#f4c66a" : "#d28a35"}
                style={{ marginVertical: 10 }}
              />
              <Text className={`text-base font-semibold ${item.time === "Now" ? "text-white" : "text-[#1b2b26]"}`}>
                {item.temp}°
              </Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function WeatherDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 border-r border-[#d7e1dc] px-2 last:border-r-0">
      <View className="mb-3">{icon}</View>
      <Text className="text-xs text-[#708078]">{label}</Text>
      <Text className="mt-1 text-[17px] font-semibold text-[#1b2b26]">{value}</Text>
    </View>
  );
}
