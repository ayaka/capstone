import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { db } from "../firebase";
import { doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

import CustomSwitch from "../components/CustomSwitch";
import globalStyles from "../globalStyles";
import globalColors from "../globalColors";

const LocationScreen = () => {
  const route = useRoute();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const docRef = doc(db, "pets", route.params.petId);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setStatus({ ...doc.data().walk, outside: doc.data().outside });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleBackyard = async () => {
    status.outside[0]
      ? await updateDoc(docRef, { outside: [false, null] })
      : await updateDoc(docRef, { outside: [true, Timestamp.now()] });
  };

  const toggleAmWalk = async () => {
    status.am[0]
      ? await updateDoc(docRef, { "walk.am": [false, null] })
      : await updateDoc(docRef, { "walk.am": [true, Timestamp.now()] });
  };
  const togglePmWalk = async () => {
    status.pm[0]
      ? await updateDoc(docRef, { "walk.pm": [false, null] })
      : await updateDoc(docRef, { "walk.pm": [true, Timestamp.now()] });
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.sectionContainer}>
          <CustomSwitch
            value={status.outside[0]}
            onValueChange={toggleBackyard}
            title="Backyard"
            text={
              status.outside[1]
                ? `In the backyard since ${status.outside[1]
                    .toDate()
                    .toLocaleTimeString()}`
                : "Not in the backyard"
            }
          />

          <CustomSwitch
            value={status.am[0]}
            onValueChange={toggleAmWalk}
            title="AM walk"
            text={
              status.am[1]
                ? `Went out for a walk at ${status.am[1]
                    .toDate()
                    .toLocaleTimeString()}`
                : "Hasn't been walked this morning"
            }
          />

          <CustomSwitch
            value={status.pm[0]}
            onValueChange={togglePmWalk}
            title="PM walk"
            text={
              status.pm[1]
                ? `Went out for a walk at ${status.pm[1]
                    .toDate()
                    .toLocaleTimeString()}`
                : "Hasn't been walked this morning"
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  sectionContainer: {
    height: "70%",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
});
