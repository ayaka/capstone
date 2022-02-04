import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

import globalColors from "../globalColors";
import CustomIcon from "../components/CustomIcon";

import * as Location from "expo-location";
import globalStyles from "../globalStyles";

const HomeScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const user = route.params.user;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentWeather, setCurrentWeather] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = onSnapshot(doc(db, "pets", user.petId), (doc) => {
        setPet(doc.data());
        setLoading(false);
      });
    } catch (error) {
      alert(error.message);
    }
    loadWeather().then((result) => {
      setCurrentWeather(result);
    });
    return () => unsubscribe();
  }, []);

  const loadWeather = async () => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=47&lon=-122&appid=${process.env.WEATHER_API_KEY}`;

      // const location = await loadLocation();
      // const { latitude, longitude } = location.coords;
      // const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`;
      const response = await fetch(weatherUrl);
      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        throw new Error();
      }
    } catch (error) {
      setErrorMessage("Weather could not be loaded");
    }
  };

  const loadLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw { message: "Permission to access location was denied" };
    }
    return await Location.getCurrentPositionAsync({});
  };

  const WeatherInfo = () => {
    if (currentWeather) {
      const {
        current: {
          temp,
          weather: [{ icon, description }],
        },
      } = currentWeather;

      const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

      return (
        <View style={globalStyles.container}>
          <View style={styles.weatherCurrent}>
            <Image style={styles.weatherIcon} source={{ uri: iconUrl }} />
            {/* <View> */}
            <Text style={styles.weatherDescription}>{description}</Text>
            <Text>{temp}</Text>
            {/* </View> */}
          </View>

          {/* possible enhancement */}
          {/* <View style={styles.weatherForecast}></View> */}
        </View>
      );
    } else {
      return <Text>{errorMessage}</Text>;
    }
  };

  return loading ? (
    <SafeAreaView style={styles.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.weatherSectionContainer}>
          <View style={styles.weatherContainer}>
            <WeatherInfo />
          </View>
        </View>

        <View style={styles.petSectionContainer}>
          <View style={styles.petContainer}>
            <Text style={styles.text}>Pet info here</Text>
          </View>
        </View>

        <View style={styles.iconSectionContainer}>
          <View style={styles.iconContainer}>
            <CustomIcon
              onPress={() => navigation.navigate("Food", { petId: pet.id })}
              text="Meals & Snacks"
            />
            <CustomIcon
              onPress={() =>
                navigation.navigate({
                  name: "Location",
                  params: { petId: pet.id },
                })
              }
              text="Inside / Outside"
            />
          </View>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: globalColors.blue,
  },
  iconSectionContainer: {
    // flex: 1,
    width: "100%",
    paddingHorizontal: "10%",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
    paddingVertical: "10%",
    justifyContent: "space-between",
  },
  petContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: globalColors.green,
  },
  petSectionContainer: {
    flex: 3,
    width: "100%",
    paddingHorizontal: "10%",
    paddingVertical: "5%",
  },
  text: {
    textAlign: "center",
  },
  weatherContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: globalColors.white,
  },
  weatherDescription: {
    textTransform: "capitalize",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherCurrent: {
    flex: 1,
    width: "100%",
    padding: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // weatherForecast: {
  //   flex: 1,
  //   width: "100%",
  //   padding: "10%",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  weatherSectionContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: "10%",
    // paddingVertical: "5%",
  },
});
