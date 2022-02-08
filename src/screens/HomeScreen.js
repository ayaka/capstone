import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

import globalColors from "../globalColors";
import CustomIcon from "../components/CustomIcon";

import * as Location from "expo-location";
import globalStyles from "../globalStyles";
import { ActivityIndicator } from "react-native-paper";

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
            <Text style={[styles.text, styles.weatherDescription]}>
              {description}
            </Text>
            <Text style={styles.text}>{temp}</Text>
            {/* </View> */}
          </View>

          {/* possible enhancement */}
          {/* <View style={styles.weatherForecast}></View> */}
        </View>
      );
    } else if (errorMessage) {
      return <Text style={styles.text}>{errorMessage}</Text>;
    } else {
      return <ActivityIndicator animating={true} color={globalColors.blue} />;
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
            <View style={styles.imageContainer}>
              <Pressable
                onPress={() =>
                  navigation.navigate("ImageCapture", { petId: pet.id })
                }
              >
                <Text>Add Image</Text>
              </Pressable>
              <Image
                style={styles.image}
                source={require("../assets/IMG_0024.jpg")}
              />
            </View>
          </View>
        </View>

        <View style={styles.iconSectionContainer}>
          <View style={styles.iconContainer}>
            <CustomIcon
              onPress={() => navigation.navigate("Food", { petId: pet.id })}
              text1="Meals &"
              text2="Snacks"
            />
            <CustomIcon
              onPress={() =>
                navigation.navigate({
                  name: "Location",
                  params: { petId: pet.id },
                })
              }
              text1="Inside /"
              text2="Outside"
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
  image: {
    resizeMode: "contain",
    width: 200,
    height: 300,
  },
  imageContainer: {
    width: "80%",
    aspectRatio: 1,
    backgroundColor: globalColors.white,
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
    alignItems: "center",
    backgroundColor: globalColors.black,
  },
  petSectionContainer: {
    flex: 3,
    width: "100%",
    paddingHorizontal: "10%",
    paddingVertical: "5%",
  },
  text: {
    color: globalColors.olive,
    fontSize: 13,
    fontWeight: "700",
  },
  weatherContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    // backgroundColor: "#ff8552",
    // backgroundColor: "#f6ae2d",
    backgroundColor: "#f9df74",
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
