import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

import globalColors from "../globalColors";
import CustomIcon from "../components/CustomIcon";

import * as Location from "expo-location";

const HomeScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const user = route.params.user;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = onSnapshot(doc(db, "pets", user.petId), (doc) => {
        setPet(doc.data());
        setLoading(false);
      });
      loadWeather().then((result) => {
        setCurrentWeather(result);
      });
    } catch (error) {
      alert(error.message);
    }
    return () => unsubscribe();
  }, []);

  const loadWeather = async () => {
    const location = await loadLocation();
    const { latitude, longitude } = location.coords;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`;
    const response = await fetch(weatherUrl);
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw { message: result.message };
    }
  };

  const loadLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // setErrorMessage("Permission to access location was denied");
      throw { message: "Permission to access location was denied" };
    }
    return await Location.getCurrentPositionAsync({});
  };

  return loading ? (
    <SafeAreaView style={styles.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Text>{currentWeather && currentWeather.weather[0].description}</Text>

      <View style={styles.mainContainer}>
        <Text>{pet.name}</Text>
      </View>
      <View style={styles.iconContainer}>
        <CustomIcon
          onPress={() => navigation.navigate("Food", { petId: pet.id })}
          text="Meals & Snacks"
        />
        <CustomIcon
          onPress={() =>
            navigation.navigate({ name: "Location", params: { petId: pet.id } })
          }
          text="Inside / Outside"
        />
        <CustomIcon text="Walk" />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: globalColors.blue,
  },
  mainContainer: {
    flex: 4,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
