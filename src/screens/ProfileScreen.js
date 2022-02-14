import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomButton from "../components/CustomButton";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../globalStyles";
import globalColors from "../globalColors";

const ProfileScreen = () => {
  const navigation = useNavigation();

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
      <View style={styles.mainContainer}>
        <View style={styles.profileContainer}>
          <Text>Some Profile Info</Text>
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
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
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
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
