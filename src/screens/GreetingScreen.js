import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "../components/CustomButton";
import globalStyles from "../globalStyles";

const GreetingScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const directLogin = async () => {
    await signOut(auth);
    navigation.navigate("Login");
  };

  const directRegister = async () => {
    await signOut(auth);
    // navigation.navigate("Register")
  };

  const Greeting = () => {
    if (loading) {
      return <Text style={styles.text}>Loading...</Text>;
    } else if (user) {
      return (
        <View style={styles.greeting}>
          {/* change user.email to user.username */}
          <Text style={styles.title}>Welcome Back{"\n" + user.email}</Text>
          <Pressable
            // onPress={() => navigation.replace("Home")}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1.0 },
              styles.icon,
            ]}
          >
            <Text>Main Page</Text>
          </Pressable>
          {/* change user.email to user.username */}
          <Text style={styles.text}>Not {user.email}?</Text>
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
        {/* <Text>{loading ? "Loading..." : null}</Text> */}
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
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
    borderRadius: 35,
  },
  text: {},
  title: {
    textAlign: "center",
    fontSize: 30,
  },
});
