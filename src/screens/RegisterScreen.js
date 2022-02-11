import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
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

  let petDocRef;
  let userCred;
  let userDocRef;

  const handleRegister = async () => {
    try {
      await registerUser();
      try {
        await getPetDocRef();
        await getUserDocRef(petDocRef.id);
        const userDocSnap = await getDocSnap(userDocRef);
        navigation.replace("Home", {
          user: userDocSnap.data(),
        });
      } catch (error) {
        // erase user and pet data if created in firestore
        if (petDocRef) await deleteDoc(doc(db, "pets", petDocRef.id));
        if (userDocRef) await deleteDoc(doc(db, "users", userDocRef.id));

        alert(error.message);
      }
    } catch (error) {
      alert(error.message);
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
    if ((!petName && !petId) || (petName && petId)) {
      throw { message: "Please enter id or name for your pet" };
    } else if (petName) {
      // register new pet
      const docRef = doc(collection(db, "pets"));
      await setDoc(docRef, {
        id: docRef.id,
        name: petName,
        date: Timestamp.now(),
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

      petDocRef = docRef;
    } else if (petId) {
      // access existing pet account
      const docRef = doc(db, "pets", petId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw { message: "Invalid pet id" };
      }
      return docRef;
    }
  };

  const getUserDocRef = async (petDocId) => {
    // create new user account
    const docRef = doc(db, "users", userCred.user.uid);
    setDoc(docRef, {
      username: username,
      id: userCred.user.uid,
      email: email,
      petId: petDocId,
    });
    userDocRef = docRef;
  };

  const registerUser = async () => {
    // register user for auth
    if (password !== passwordConf) {
      throw { message: "Password and password confirmation do not match" };
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    userCred = cred;
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // enabled
    >
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
