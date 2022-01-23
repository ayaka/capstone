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
import CustomButton from "../components/CustomButton";

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
      <CustomButton
        onPress={handleLogin}
        buttonStyle={[globalStyles.button, globalStyles.buttonSolid]}
        buttonTextStyle={globalStyles.buttonSolidTextStyle}
        text="Log in"
      />
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
