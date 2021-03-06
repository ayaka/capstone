import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { ActivityIndicator } from "react-native-paper";
import * as Location from "expo-location";

import { db } from "../firebase";
import { doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";

import CustomIcon from "../components/CustomIcon";
import globalColors from "../globalColors";
import globalStyles from "../globalStyles";

const HomeScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const user = route.params.user;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = onSnapshot(doc(db, "pets", user.petId), (doc) => {
        let petData = doc.data();

        if (isNewDay(petData.date)) {
          resetDailyData(petData);
        } else {
          setPet(petData);
          setLoading(false);
        }
      });
    } catch (error) {
      Alert.alert(error.message);
    }
    loadWeather().then((result) => {
      const {
        temp,
        weather: [{ icon, description }],
      } = result.current;
      const hourly = result.hourly;

      const data = {
        current: { temp, weather: [{ icon, description }] },
        hourly: hourly,
      };
      setWeatherData(data);
    });
    return () => unsubscribe();
  }, []);

  const isNewDay = (date) => {
    // checks if app is opened for the first time today
    const monthToday = new Date().getMonth();
    const dateToday = new Date().getDate();

    const monthDoc = new Date(date.toDate()).getMonth();
    const dateDoc = new Date(date.toDate()).getDate();
    return monthDoc !== monthToday || dateDoc !== dateToday;
  };

  const resetDailyData = async (data) => {
    const newData = {
      ...data,
      date: Timestamp.now(),
      food: {
        leftover: [null, null, null],
        breakfast: [false, null, null],
        dinner: [false, null, null],
        treat: [false, null, null],
        extraTreats: 0,
      },
      walk: {
        am: [false, null, null],
        pm: [false, null, null],
      },
      outside: [false, null],
    };

    const docRef = doc(db, "pets", data.id);
    await setDoc(docRef, newData);
  };

  const loadWeather = async () => {
    try {
      const location = await loadLocation();
      const { latitude, longitude } = location.coords;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`;
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

  const getWeatherInfo = (data) => {
    const {
      temp: kelvin,
      weather: [{ icon, description }],
    } = data;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    // convert to fahrenheit
    const temp = Math.round(((kelvin - 273.15) * 9) / 5 + 32);

    return { temp, iconUrl, description };
  };

  const CurrentWeather = () => {
    if (weatherData) {
      const { temp, iconUrl, description } = getWeatherInfo(
        weatherData.current
      );

      return (
        <View style={styles.weatherCurrent}>
          <Image style={styles.weatherIcon} source={{ uri: iconUrl }} />
          <Text style={[styles.text, styles.weatherDescription]}>
            {description}
          </Text>
          <Text style={styles.text}>{temp}??</Text>
        </View>
      );
    } else if (errorMessage) {
      return <Text style={styles.text}>{errorMessage}</Text>;
    } else {
      return <ActivityIndicator animating={true} color={globalColors.blue} />;
    }
  };

  const WeatherForecast = () => {
    const data = weatherData.hourly.map((hourlyData, hour) => {
      const { temp, iconUrl } = getWeatherInfo(hourlyData);
      return { temp, iconUrl, hour };
    });

    return (
      <View style={styles.weatherForecast}>
        <Text style={[styles.text, { fontSize: 12, marginRight: 10 }]}>
          Next
        </Text>
        <FlatList
          keyExtractor={(item) => item.hour}
          data={data}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={styles.weatherForecastHour}>
              <Text style={[styles.text, { fontSize: 12 }]}>
                {item.hour + 1}h
              </Text>
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: item.iconUrl }}
              />
              <Text style={[styles.text, { fontSize: 12 }]}>{item.temp}??</Text>
            </View>
          )}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <ActivityIndicator animating={true} color={globalColors.blue} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <View style={styles.mainContainer}>
        <View style={styles.weatherSectionContainer}>
          {weatherData ? (
            <View style={styles.weatherContainer}>
              <CurrentWeather />
              <WeatherForecast />
            </View>
          ) : errorMessage ? (
            <Text style={styles.text}>{errorMessage}</Text>
          ) : (
            <ActivityIndicator animating={true} color={globalColors.blue} />
          )}
        </View>

        <View style={styles.petSectionContainer}>
          <View style={styles.petContainer}>
            <Text style={styles.name}>{pet.name}</Text>
            <View style={styles.imageContainer}>
              {pet.imageUrl ? (
                <>
                  <Image style={styles.image} source={{ uri: pet.imageUrl }} />
                  <IconButton
                    icon="camera"
                    color={globalColors.rose}
                    size={35}
                    onPress={() =>
                      navigation.navigate("Camera", { petId: pet.id })
                    }
                    style={styles.cameraIcon}
                  />
                </>
              ) : (
                <IconButton
                  icon="camera"
                  color={globalColors.rose}
                  size={60}
                  onPress={() =>
                    navigation.navigate("Camera", { petId: pet.id })
                  }
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.iconSectionContainer}>
          <View style={styles.iconContainer}>
            <CustomIcon
              onPress={() =>
                navigation.navigate("Food", {
                  petId: pet.id,
                  userName: user.username,
                })
              }
              image={
                <Image
                  source={require("../assets/pet-bowl.png")}
                  style={{ width: "50%", height: "50%", resizeMode: "contain" }}
                />
              }
            />
            <CustomIcon
              onPress={() =>
                navigation.navigate({
                  name: "Location",
                  params: { petId: pet.id, userName: user.username },
                })
              }
              image={
                <Image
                  source={require("../assets/wait.png")}
                  style={{ width: "50%", height: "50%", resizeMode: "contain" }}
                />
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cameraIcon: {
    position: "absolute",
    top: -13,
    right: -13,
  },
  container: {
    backgroundColor: globalColors.honeydew,
  },
  iconContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconSectionContainer: {
    flex: 1,
    width: "100%",
  },
  image: {
    resizeMode: "contain",
    height: "90%",
    width: "90%",
  },
  imageContainer: {
    width: "90%",
    aspectRatio: 1,
    backgroundColor: globalColors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
    paddingVertical: "10%",
    paddingHorizontal: "10%",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: globalColors.white,
    position: "absolute",
    top: "2%",
  },
  petContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.black,
    shadowColor: globalColors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  },
  petSectionContainer: {
    flex: 3,
    width: "100%",
    paddingVertical: "5%",
  },
  text: {
    color: globalColors.black,
    fontSize: 17,
    fontWeight: "700",
  },
  weatherContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  weatherForecast: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  weatherForecastHour: {
    flex: 1,
    marginHorizontal: 13,
    alignItems: "center",
  },
  weatherSectionContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.lightBlue2,
    paddingHorizontal: 20,
    shadowColor: globalColors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  },
});
