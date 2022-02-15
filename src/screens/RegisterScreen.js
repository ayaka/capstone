import { Alert, KeyboardAvoidingView, TextInput } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import CustomButton from "../components/CustomButton";
import globalColors from "../globalColors";
import globalStyles from "../globalStyles";

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
        navigation.replace("Main", {
          screen: "Home",
          params: {
            user: userDocSnap.data(),
          },
        });
      } catch (error) {
        // erase data from firebase auth/firestore if created
        if (petDocRef) await deleteDoc(doc(db, "pets", petDocRef.id));
        if (userDocRef) await deleteDoc(doc(db, "users", userDocRef.id));
        await deleteUser(auth.currentUser);
        Alert.alert(error.message);
      }
    } catch (error) {
      Alert.alert(error.message);
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
      throw { message: "Please enter either id or name  your pet" };
    } else if (petName) {
      // register new pet
      const docRef = doc(collection(db, "pets"));
      await setDoc(docRef, {
        id: docRef.id,
        name: petName,
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
    >
      <TextInput
        onChangeText={(value) => setUsername(value)}
        style={globalStyles.input}
        placeholder="Username"
        value={username}
        selectionColor={globalColors.blue}
      />
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
      <TextInput
        onChangeText={(value) => setPasswordConf(value)}
        style={globalStyles.input}
        placeholder="Confirm Password"
        value={passwordConf}
        secureTextEntry
        selectionColor={globalColors.blue}
      />
      <TextInput
        onChangeText={(value) => setPetId(value)}
        style={globalStyles.input}
        placeholder="Pet ID if your pet is already registered"
        value={petId}
        selectionColor={globalColors.blue}
      />
      <TextInput
        onChangeText={(value) => setPetName(value)}
        style={globalStyles.input}
        placeholder="Pet name to register your pet"
        value={petName}
        selectionColor={globalColors.blue}
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
