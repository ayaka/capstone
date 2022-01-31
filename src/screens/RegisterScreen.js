import { KeyboardAvoidingView, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";
import CustomButton from "../components/CustomButton";
import globalStyles from "../globalStyles";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [petId, setPetId] = useState("");
  const [petName, setPetName] = useState("");

  const handleRegister = async () => {
    try {
      const petDocRef = await getPetDocRef();
      const userDocRef = await getUserDocRef(petDocRef.id);
      const petDocSnap = await getDocSnap(petDocRef);
      const userDocSnap = await getDocSnap(userDocRef);

      navigation.replace("Home", {
        // pet: petDocSnap.data(),
        // petDocRef: petDocRef,
        user: userDocSnap.data(),
        // userDocRef: userDocRef,
      });
    } catch (error) {
      console.log(error.message);
      // TODO: erase user and pet registration
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

  const getPetDocRef = async () => {
    if (!petName && !petId) {
      throw { message: "Please enter id or name for your pet" };
    } else if (petName) {
      // register new pet
      const docRef = doc(collection(db, "pets"));
      await setDoc(docRef, {
        id: docRef.id,
        name: petName,
        food: {
          leftover: [null, null],
          breakfast: [false, null],
          dinner: [false, null],
          treat: [false, null],
          extraTreats: 0,
        },
        walk: {
          am: [false, null],
          pm: [false, null],
        },
        outside: [false, null],
      });

      return docRef;
    } else if (petId) {
      // access existing pet account
      const docRef = doc(db, "pets", petId);
      return docRef;
    }
  };

  const getUserDocRef = async (petDocId) => {
    const userCred = await registerUser();
    // create new user account
    const docRef = doc(db, "users", userCred.user.uid);
    setDoc(docRef, {
      username: username,
      id: userCred.user.uid,
      email: email,
      petId: petDocId,
    });
    return docRef;
  };

  const registerUser = async () => {
    // register user for auth
    if (password !== passwordConf) {
      throw { message: "Password and password confirmation do not match" };
    }
    const cred = createUserWithEmailAndPassword(auth, email, password);
    return cred;
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TextInput
        onChangeText={(value) => setUsername(value)}
        style={globalStyles.input}
        placeholder="Username"
        value={username}
      />
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
      <TextInput
        onChangeText={(value) => setPasswordConf(value)}
        style={globalStyles.input}
        placeholder="Confirm Password"
        value={passwordConf}
        secureTextEntry
      />
      <TextInput
        // TODO: disable petName input if petId is not empty
        onChangeText={(value) => setPetId(value)}
        style={globalStyles.input}
        placeholder="Pet ID if your pet is already registered"
        value={petId}
      />
      <TextInput
        // TODO: disable petID input if petName is not empty
        onChangeText={(value) => setPetName(value)}
        style={globalStyles.input}
        placeholder="Pet name to register your pet"
        value={petName}
      />
      <CustomButton
        onPress={handleRegister}
        buttonStyle={[globalStyles.button, globalStyles.buttonSolid]}
        buttonTextStyle={globalStyles.buttonSolidText}
        text="Register"
      />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
