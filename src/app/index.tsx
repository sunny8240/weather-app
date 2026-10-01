import {
    fetchPuneWeather,
    fetchWeatherByCoordinates,
    PUNE_COORDINATES,
    searchCitiesByName,
    type GeoCityResult,
} from "@/services/weatherApi";
import { CurrentWeather } from "@/types/weather";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Animated,
    Easing,
    FlatList,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type WeatherIconName = keyof typeof Ionicons.glyphMap;

const noInternetAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 90,
  w: 320,
  h: 320,
  nm: "NoInternet",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Pulse",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [160, 160, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [84, 84, 100] },
            { t: 30, s: [104, 104, 100] },
            { t: 60, s: [120, 120, 100] },
            { t: 90, s: [84, 84, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [200, 200] }, nm: "Ellipse Path 1" },
            { ty: "fl", c: { a: 0, k: [0.74, 0.86, 0.79, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill 1" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
          ],
          nm: "Pulse Circle",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Cloud",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [160, 170, 0] },
            { t: 45, s: [168, 175, 0] },
            { t: 90, s: [160, 170, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100] },
            { t: 45, s: [106, 106, 100] },
            { t: 90, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [-52, 32] }, s: { a: 0, k: [60, 60] }, nm: "Cloud 1" },
            { ty: "el", p: { a: 0, k: [0, 18] }, s: { a: 0, k: [76, 64] }, nm: "Cloud 2" },
            { ty: "el", p: { a: 0, k: [52, 28] }, s: { a: 0, k: [62, 52] }, nm: "Cloud 3" },
            { ty: "fl", c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Cloud Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
          ],
          nm: "Cloud Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Cross",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 35, s: [10] },
            { t: 70, s: [-10] },
            { t: 90, s: [0] },
          ],
        },
        p: { a: 0, k: [160, 170, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [24, 118] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, nm: "Bar 1" },
            { ty: "rc", d: 1, s: { a: 0, k: [118, 24] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, nm: "Bar 2" },
            { ty: "fl", c: { a: 0, k: [0.22, 0.45, 0.39, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Cross Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
          ],
          nm: "Cross Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
};

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
  if ([1, 2, 3].includes(weatherCode)) return "partly-sunny-outline";
  if ([45, 48].includes(weatherCode)) return "cloudy-outline";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "rainy-outline";
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "snow-outline";
  if ([95, 96, 99].includes(weatherCode)) return "thunderstorm-outline";
  return "cloudy-outline";
}

function formatHourLabel(timestamp: string, index: number): string {
  if (index === 0) {
    return "Now";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(date);
}

function formatDayLabel(dateString: string, index: number): string {
  if (index === 0) {
    return "Today";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

function formatLocationName(
  location: Location.LocationGeocodedAddress | null,
): string {
  if (!location) {
    return "Current location";
  }

  const mainPlace = location.city ?? location.subregion ?? location.region ?? "Current location";
  const extras = [location.region, location.country].filter(
    (value): value is string => Boolean(value) && value !== mainPlace,
  );

  return [mainPlace, ...extras].join(", ");
}

export default function HomeScreen() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [locationName, setLocationName] = useState("Pune, Maharashtra");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<GeoCityResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const pulseAnim = useMemo(() => new Animated.Value(0.7), []);

  function formatCityLabel(city: GeoCityResult): string {
    return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
  }

  function getFriendlyErrorMessage(errorValue: unknown): string {
    if (errorValue instanceof Error) {
      const message = errorValue.message.toLowerCase();

      if (message.includes("network") || message.includes("failed to fetch") || message.includes("internet")) {
        return "No internet connection. Check your connection and try again.";
      }

      return errorValue.message;
    }

    return "Something went wrong while loading the weather.";
  }

  const loadWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLocationNotice(null);

    try {
      let latitude = PUNE_COORDINATES.latitude;
      let longitude = PUNE_COORDINATES.longitude;
      let resolvedLocationName = "Pune, Maharashtra";

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });

        latitude = currentPosition.coords.latitude;
        longitude = currentPosition.coords.longitude;

        const [geoLocation] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        resolvedLocationName = formatLocationName(geoLocation);
      } else if (status === "denied") {
        setLocationNotice("Location access is off, so the app is showing Pune weather.");
      } else {
        setLocationNotice("Location permission is unavailable right now, so Pune weather is being shown.");
      }

      setLocationName(resolvedLocationName);
      setWeather(await fetchWeatherByCoordinates({ latitude, longitude }));
    } catch {
      setLocationName("Pune, Maharashtra");
      setLocationNotice("We could not reach your current location, so the app is showing Pune weather.");

      try {
        setWeather(await fetchPuneWeather());
      } catch (fallbackError) {
        setError(getFriendlyErrorMessage(fallbackError));
        setWeather(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleCitySearch() {
    const trimmed = searchText.trim();

    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await searchCitiesByName(trimmed);
      setSearchResults(results);

      if (results.length > 0) {
        const selectedCity = results[0];
        const nextLocationName = formatCityLabel(selectedCity);
        setLocationName(nextLocationName);
        setWeather(
          await fetchWeatherByCoordinates({
            latitude: selectedCity.latitude,
            longitude: selectedCity.longitude,
          }),
        );
      } else {
        setError("No city matched your search. Try another name.");
      }
    } catch (error) {
      setError(getFriendlyErrorMessage(error));
    } finally {
      setIsSearching(false);
    }
  }

  async function handleCitySelect(city: GeoCityResult) {
    setSearchText(city.name);
    setSearchResults([]);
    setLocationName(formatCityLabel(city));
    setError(null);
    setLocationNotice(null);
    setIsLoading(true);

    try {
      setWeather(
        await fetchWeatherByCoordinates({
          latitude: city.latitude,
          longitude: city.longitude,
        }),
      );
    } catch (error) {
      setError(getFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadWeather();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadWeather]);

  useEffect(() => {
    if (!isLoading) {
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.72,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [isLoading, pulseAnim]);

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
            <View className="mr-2.5 h-9 w-9 items-center justify-center rounded-full bg-[#dfece5]">
              <Ionicons name="location-outline" size={18} color="#52796c" />
            </View>
            <View>
              <Text className="text-[11px] font-semibold uppercase text-[#52796c]">Local forecast</Text>
              <Text className="mt-0.5 text-lg font-semibold text-[#1b2b26]">{locationName}</Text>
            </View>
          </View>
          <View className="flex-row items-center rounded-full bg-[#dcebe3] px-3 py-1.5">
            <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#4f806e]" />
            <Text className="text-[10px] font-semibold uppercase text-[#365f51]">
              {isLoading ? "Updating" : error ? "Offline" : "Live"}
            </Text>
          </View>
        </View>

        <View className="mt-5 rounded-[22px] border border-[#dfe9e2] bg-white p-3">
          <Text className="text-[11px] font-semibold uppercase text-[#789087]">Search city</Text>
          <View className="mt-2 flex-row items-center rounded-2xl border border-[#d7e1dc] bg-[#f7faf8] px-3 py-2">
            <Ionicons name="search-outline" size={17} color="#52796c" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Type a city"
              placeholderTextColor="#7f8f8a"
              onSubmitEditing={handleCitySearch}
              className="ml-2 flex-1 text-base text-[#1b2b26]"
            />
            <Pressable
              onPress={handleCitySearch}
              className="ml-2 rounded-full bg-[#365f51] px-3 py-1.5"
              disabled={isSearching}
            >
              <Text className="text-xs font-semibold text-white">{isSearching ? "..." : "Search"}</Text>
            </Pressable>
          </View>

          {locationNotice ? (
            <View className="mt-3 rounded-xl border border-[#e7d7a9] bg-[#fff7dc] px-3 py-2">
              <Text className="text-sm text-[#7a5d11]">{locationNotice}</Text>
            </View>
          ) : null}

          {searchResults.length > 0 ? (
            <View className="mt-3 gap-2">
              {searchResults.map((city) => (
                <Pressable
                  key={`${city.name}-${city.country}-${city.latitude}`}
                  onPress={() => handleCitySelect(city)}
                  className="rounded-xl border border-[#d7e1dc] bg-[#f5f9f7] p-2"
                >
                  <Text className="text-sm font-medium text-[#1b2b26]">{formatCityLabel(city)}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View className="pt-6">
          <Text className="text-[11px] font-semibold uppercase text-[#789087]">Current conditions</Text>
          {error ? (
            <View className="mt-5 min-h-[220px] justify-center rounded-[28px] border border-[#ead7d3] bg-[#fbf5f4] p-5">
              <LottieView
                source={noInternetAnimation}
                autoPlay
                loop
                style={{ width: 180, height: 180, alignSelf: "center" }}
              />
              <Text className="mt-2 text-base leading-6 text-center text-[#812f28]">{error}</Text>
              <Pressable className="mt-5 self-center rounded-full bg-[#365f51] px-4 py-2" onPress={loadWeather}>
                <Text className="text-sm font-semibold text-white">Try again</Text>
              </Pressable>
            </View>
          ) : isLoading ? (
            <Animated.View
              style={{ opacity: pulseAnim, transform: [{ scale: pulseAnim }] }}
              className="mt-5 min-h-[180px] justify-center rounded-[28px] border border-[#dfe9e2] bg-[#f7faf8] p-5"
            >
              <View className="items-center">
                <Animated.View
                  style={{ opacity: pulseAnim }}
                  className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#dfeee6]"
                >
                  <Ionicons name="cloud-download-outline" size={36} color="#365f51" />
                </Animated.View>
                <Text className="text-lg font-semibold text-[#29463d]">Fetching the latest weather</Text>
                <Text className="mt-2 text-sm text-[#708078]">Checking the sky and your location...</Text>
                <View className="mt-4 flex-row items-center">
                  {[0, 1, 2].map((item) => (
                    <Animated.View
                      key={item}
                      style={{ opacity: pulseAnim, transform: [{ translateY: pulseAnim.interpolate({ inputRange: [0.7, 1], outputRange: [4, 0] }) }] }}
                      className={`mx-1 h-2.5 w-2.5 rounded-full ${item === 0 ? "bg-[#9cb8ae]" : item === 1 ? "bg-[#6c9488]" : "bg-[#365f51]"}`}
                    />
                  ))}
                </View>
              </View>
            </Animated.View>
          ) : weather ? (
            <View className="mt-5 overflow-hidden rounded-[28px] border border-[#d7e1dc] bg-[#f8fbf9] p-5 shadow-sm shadow-[#d7e1dc]">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-[84px] leading-[92px] font-light text-[#1b2b26]">
                    {Math.round(weather.temperature)}°
                  </Text>
                  <Text className="mt-1 text-xl font-medium text-[#30483e]">{condition}</Text>
                  <Text className="mt-1.5 text-sm text-[#708078]">
                    Feels like {Math.round(weather.apparentTemperature)}°
                  </Text>
                </View>
                <View className="h-20 w-20 items-center justify-center rounded-full bg-[#f3e9d6]">
                  <Ionicons name={getWeatherIcon(weather.weatherCode)} size={60} color="#d28a35" />
                </View>
              </View>
            </View>
          ) : null}
        </View>

        <View className="border-b border-[#d7e1dc] py-6">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-[11px] font-semibold uppercase text-[#789087]">Weather details</Text>
            <Text className="text-xs text-[#789087]">NOW</Text>
          </View>
          {weather ? (
            <View className="flex-row rounded-[24px] border border-[#d7e1dc] bg-white p-3">
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

        {weather ? (
          <>
            <View className="flex-row items-end justify-between pb-4 pt-7">
              <Text className="text-xl font-semibold text-[#1b2b26]">Hourly forecast</Text>
              <Text className="text-[10px] font-semibold uppercase text-[#789087]">Today</Text>
            </View>
            <FlatList
              data={weather.hourlyForecast.slice(0, 8)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `${item.time}-${index}`}
              contentContainerStyle={{ paddingRight: 20 }}
              renderItem={({ item, index }) => {
                const isNow = index === 0;
                const label = formatHourLabel(item.time, index);

                return (
                  <View
                    className={`mr-2.5 min-h-[108px] w-[72px] items-center justify-center rounded-xl border px-2 py-3 ${isNow ? "border-[#365f51] bg-[#365f51]" : "border-[#d7e1dc] bg-white"}`}
                  >
                    <Text className={`text-xs ${isNow ? "font-semibold text-white" : "text-[#708078]"}`}>
                      {label}
                    </Text>
                    <Ionicons
                      name={getWeatherIcon(item.weatherCode)}
                      size={24}
                      color={isNow ? "#f4c66a" : "#d28a35"}
                      style={{ marginVertical: 10 }}
                    />
                    <Text className={`text-base font-semibold ${isNow ? "text-white" : "text-[#1b2b26]"}`}>
                      {Math.round(item.temperature)}°
                    </Text>
                  </View>
                );
              }}
            />

            <View className="pb-4 pt-8">
              <Text className="text-xl font-semibold text-[#1b2b26]">7-day forecast</Text>
              <View className="mt-4 gap-2">
                {weather.dailyForecast.map((day, index) => (
                  <View
                    key={day.date}
                    className="flex-row items-center justify-between rounded-2xl border border-[#d7e1dc] bg-white px-3 py-3"
                  >
                    <Text className="w-12 text-sm font-medium text-[#1b2b26]">
                      {formatDayLabel(day.date, index)}
                    </Text>
                    <View className="ml-2 flex-row items-center">
                      <Ionicons name={getWeatherIcon(day.weatherCode)} size={18} color="#d28a35" />
                      <Text className="ml-2 text-xs text-[#708078]">{getWeatherCondition(day.weatherCode)}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-semibold text-[#1b2b26]">
                        {Math.round(day.maxTemperature)}°
                      </Text>
                      <Text className="text-sm text-[#708078]">{Math.round(day.minTemperature)}°</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : null}
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
