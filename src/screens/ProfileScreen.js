import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../globalStyles";
import globalColors from "../globalColors";
import { ActivityIndicator } from "react-native-paper";

const ProfileScreen = () => {
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

  const logOut = async () => {
    try {
      await signOut(auth);
      navigation.replace("Greeting");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.profileContainer}>
            <Text style={styles.text}>Some Profile Info</Text>
            <Text style={styles.text}>Some Profile Info</Text>
            <Text style={styles.text}>Some Profile Info</Text>
            <Text style={styles.text}>Some Profile Info</Text>
            <Text style={styles.text}>Pet ID: {user.petId}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={logOut}
              buttonStyle={[globalStyles.button, globalStyles.buttonOutline]}
              buttonTextStyle={globalStyles.buttonOutlineText}
              text="Sign Out"
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.honeydew,
  },
  mainContainer: {
    flex: 1,
    width: "90%",
    paddingVertical: "25%",
  },
  profileContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.white,
  },
  text: {
    marginVertical: 10,
    fontSize: 18,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "700",
  },
});
