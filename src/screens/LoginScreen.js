import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import CustomButton from "../components/CustomButton";
import globalColors from "../globalColors";
import globalStyles from "../globalStyles";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", cred.user.uid);
      const userDocSnap = await getDocSnap(userDocRef);

      navigation.replace("Main", {
        screen: "Home",
        params: {
          user: userDocSnap.data(),
        },
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const getDocSnap = async (docRef) => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap;
    } else {
      throw { message: "No data found" };
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
    >
      <TextInput
        onChangeText={(value) => setEmail(value)}
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        selectionColor={globalColors.blue}
      />
      <TextInput
        onChangeText={(value) => setPassword(value)}
        style={globalStyles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        selectionColor={globalColors.blue}
      />
      <CustomButton
        onPress={handleLogin}
        buttonStyle={[globalStyles.button, globalStyles.buttonSolid]}
        buttonTextStyle={globalStyles.buttonSolidText}
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
});
