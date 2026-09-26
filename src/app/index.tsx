import { Ionicons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function HomeScreen() {
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
            <Text style={styles.subtitle}>Current weather</Text>
          </View>

          <Ionicons
            name="location-outline"
            size={24}
            color="#222"
          />
        </View>

        {/* Current Weather */}
        <View style={styles.currentWeather}>
          <Ionicons
            name="sunny-outline"
            size={72}
            color="#222"
          />

          <Text style={styles.temperature}>28°</Text>

          <Text style={styles.condition}>Sunny</Text>

          <Text style={styles.feelsLike}>
            Feels like 30°
          </Text>
        </View>

        {/* Weather Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={22} color="#222" />
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>65%</Text>
          </View>

          <View style={styles.detailItem}>
            <Feather name="wind" size={24} color="black" />
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>12 km/h</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={22} color="#222" />
            <Text style={styles.detailLabel}>Pressure</Text>
            <Text style={styles.detailValue}>1012 hPa</Text>
          </View>
        </View>

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