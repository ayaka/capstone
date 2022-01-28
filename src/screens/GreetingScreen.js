import {
  LogBox,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "../components/CustomButton";
import globalStyles from "../globalStyles";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release",
]);

const GreetingScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  let pet;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getDoc(doc(db, "users", currentUser.uid))
          .then((userDocSnap) => {
            if (userDocSnap.exists()) {
              setUser(userDocSnap.data());
            }
            setLoading(false);
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const directHome = async () => {
    try {
      const petDocSnap = await getDoc(doc(db, "pets", user.petId));
      if (petDocSnap.exists()) {
        navigation.replace("Home", {
          pet: petDocSnap.data(),
          user: user,
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
    await signOut(auth);
    navigation.navigate("Login");
  };

  const directRegister = async () => {
    await signOut(auth);
    navigation.navigate("Register");
  };

  const Greeting = () => {
    if (loading) {
      return <Text style={styles.text}>Loading...</Text>;
    } else if (user) {
      return (
        <View style={styles.greeting}>
          <Text style={styles.title}>Welcome Back{"\n" + user.username}</Text>
          <Pressable
            onPress={directHome}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1.0 },
              styles.icon,
            ]}
          >
            <Text style={styles.iconText}>Go to{"\n"}Main Page</Text>
          </Pressable>
          <Text style={styles.text}>Not {user.username}?</Text>
        </View>
      );
    } else {
      return <Text style={styles.title}>Welcome</Text>;
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
    backgroundColor: "pink",
    borderRadius: 65,
  },
  iconText: {
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 25,
  },
});
