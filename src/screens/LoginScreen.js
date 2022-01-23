import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import globalStyles from "../globalStyles";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // navigation.replace("Home")
    } catch (error) {
      // Alert.alert("Error", error.message);
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TextInput
        onChangeText={(value) => setEmail(value)}
        style={globalStyles.input}
        placeholder="Email"
        value={email}
      />
      <TextInput
        onChangeText={(value) => setPassword(value)}
        style={globalStyles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
      />
      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1.0 },
          globalStyles.button,
          styles.button,
        ]}
      >
        <Text style={globalStyles.buttonText}>Log In</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    marginTop: 40,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
