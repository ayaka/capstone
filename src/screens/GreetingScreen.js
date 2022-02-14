import { LogBox, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "../components/CustomButton";
import globalStyles from "../globalStyles";
import globalColors from "../globalColors";
import { ActivityIndicator, IconButton } from "react-native-paper";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release",
]);

const GreetingScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        getDoc(userDocRef)
          .then((userDocSnap) => {
            if (userDocSnap.exists()) {
              setUser(userDocSnap.data());
            }
            setLoading(false);
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const directHome = async () => {
    try {
      if (user) {
        navigation.replace("Main", {
          screen: "Home",
          params: {
            user: user,
          },
        });
      } else {
        throw {
          message: "Something went wrong. Please log in or register below.",
        };
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const directLogin = async () => {
    navigation.navigate("Login");
  };

  const directRegister = async () => {
    navigation.navigate("Register");
  };

  const Greeting = () => {
    if (loading) {
      return <ActivityIndicator animating={true} color={globalColors.blue} />;
    } else if (user) {
      return (
        <View style={styles.greeting}>
          <Text style={[styles.text, styles.title]}>
            Welcome Back{"\n" + user.username}
          </Text>
          <View style={styles.icon}>
            <IconButton
              icon="paw"
              color={globalColors.white}
              size={100}
              onPress={directHome}
            />
          </View>
          <Text style={styles.text}>Not {user.username}?</Text>
        </View>
      );
    } else {
      return <Text style={[styles.text, styles.title]}>Welcome</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greetingContainer}>
        <Greeting />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={directLogin}
          buttonStyle={[globalStyles.button, globalStyles.buttonSolid]}
          buttonTextStyle={globalStyles.buttonSolidText}
          text="Log In"
        />
        <CustomButton
          onPress={directRegister}
          buttonStyle={[globalStyles.button, globalStyles.buttonOutline]}
          buttonTextStyle={globalStyles.buttonOutlineText}
          text="Register"
        />
      </View>
    </SafeAreaView>
  );
};

export default GreetingScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingContainer: {
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.green,
    // backgroundColor: "#053225",
    borderRadius: 65,
  },
  text: {
    color: globalColors.brown,
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "700",
  },
});
