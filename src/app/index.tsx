import { Ionicons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPuneWeather } from "@/services/weatherApi";
import { CurrentWeather } from "@/types/weather";

const hourlyForecast = [
  {
    time: "Now",
    temp: 28,
    icon: "sunny-outline"
  },
  {
    time: "10 AM",
    temp: 29,
    icon: "sunny-outline"
  },
  {
    time: "11 AM",
    temp: 30,
    icon: "partly-sunny-outline"
  },
  {
    time: "12 PM",
    temp: 31,
    icon: "partly-sunny-outline"
  },
  {
    time: "1 PM",
    temp: 32,
    icon: "sunny-outline"
  },
  {
    time: "2 PM",
    temp: 32,
    icon: "sunny-outline"
  },
];

type WeatherIconName = keyof typeof Ionicons.glyphMap;

function getWeatherCondition(weatherCode: number): string {
  if (weatherCode === 0) return "Clear";
  if ([1, 2, 3].includes(weatherCode)) return "Cloudy";
  if ([45, 48].includes(weatherCode)) return "Foggy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return "Rainy";
  }
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "Snowy";
  if ([95, 96, 99].includes(weatherCode)) return "Stormy";
  return "Unknown";
}

function getWeatherIcon(weatherCode: number): WeatherIconName {
  if (weatherCode === 0) return "sunny-outline";
  if ([95, 96, 99].includes(weatherCode)) return "thunderstorm-outline";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return "rainy-outline";
  }
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
      const currentWeather = await fetchPuneWeather();
      setWeather(currentWeather);
    } catch {
      setError("We couldn't load the weather. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPuneWeather()
      .then((currentWeather) => {
        setWeather(currentWeather);
      })
      .catch(() => {
        setError("We couldn't load the weather. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const condition = weather ? getWeatherCondition(weather.weatherCode) : "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#696666a8" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.location}>Pune, Maharashtra</Text>
            <Text style={styles.subtitle}>
              {isLoading ? "Loading weather..." : "Current weather"}
            </Text>
          </View>

          <Ionicons
            name="location-outline"
            size={24}
            color="#222"
          />
        </View>

        {error ? (
          <View style={styles.statusContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadWeather}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : isLoading ? (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Getting the latest weather...</Text>
          </View>
        ) : weather ? (
          <>
            <View style={styles.currentWeather}>
              <Ionicons
                name={getWeatherIcon(weather.weatherCode)}
                size={72}
                color="#222"
              />

              <Text style={styles.temperature}>{Math.round(weather.temperature)}°</Text>

              <Text style={styles.condition}>{condition}</Text>

              <Text style={styles.feelsLike}>
                Feels like {Math.round(weather.apparentTemperature)}°
              </Text>
            </View>

            <View style={styles.detailsCard}>
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={22} color="#222" />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>

              <View style={styles.detailItem}>
                <Feather name="wind" size={24} color="black" />
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>{Math.round(weather.windSpeed)} km/h</Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="speedometer-outline" size={22} color="#222" />
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>{Math.round(weather.pressure)} hPa</Text>
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
        </View>

        <FlatList
          data={hourlyForecast}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.time}
          contentContainerStyle={styles.hourlyList}
          renderItem={({ item }) => (
            <View style={styles.hourCard}>
              <Text style={styles.hourTime}>{item.time}</Text>

              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={28}
                color="#222"
                style={styles.hourIcon}
              />

              <Text style={styles.hourTemp}>
                {item.temp}°
              </Text>
            </View>
          )}
        />

        {/* Timepass spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },

  location: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },

  currentWeather: {
    alignItems: "center",
    marginBottom: 35,
  },

  statusContainer: {
    alignItems: "center",
    minHeight: 280,
    justifyContent: "center",
  },

  statusText: {
    color: "#777",
    fontSize: 16,
  },

  errorText: {
    color: "#a33",
    fontSize: 16,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  retryText: {
    color: "#fff",
    fontWeight: "600",
  },

  temperature: {
    marginTop: 10,
    fontSize: 64,
    fontWeight: "600",
    color: "#111",
  },

  condition: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
  },

  feelsLike: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
  },

  detailsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 35,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },

  detailItem: {
    alignItems: "center",
    flex: 1,
  },

  detailLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#777",
  },

  detailValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },

  hourlyList: {
    paddingRight: 20,
  },

  hourCard: {
    width: 80,
    paddingVertical: 14,
    marginRight: 10,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },

  hourTime: {
    fontSize: 12,
    color: "#777",
  },

  hourIcon: {
    marginVertical: 12,
  },

  hourTemp: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
});