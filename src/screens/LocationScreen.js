import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

import { db } from "../firebase";
import { doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

import CustomSwitch from "../components/CustomSwitch";
import globalColors from "../globalColors";
import globalStyles from "../globalStyles";

const LocationScreen = () => {
  const route = useRoute();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const docRef = doc(db, "pets", route.params.petId);
  const userName = route.params.userName;

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setStatus({ ...doc.data().walk, outside: doc.data().outside });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleBackyard = async () => {
    status.outside[0]
      ? await updateDoc(docRef, { outside: [false, null, null] })
      : await updateDoc(docRef, { outside: [true, Timestamp.now(), userName] });
  };

  const toggleAmWalk = async () => {
    status.am[0]
      ? await updateDoc(docRef, { "walk.am": [false, null, null] })
      : await updateDoc(docRef, {
          "walk.am": [true, Timestamp.now(), userName],
          userName,
        });
  };
  const togglePmWalk = async () => {
    status.pm[0]
      ? await updateDoc(docRef, { "walk.pm": [false, null, null] })
      : await updateDoc(docRef, {
          "walk.pm": [true, Timestamp.now(), userName],
        });
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
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
                ? `${status.outside[2]} let the dog out ${status.outside[1]
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
                ? `Walked with ${status.am[2]} at ${status.am[1]
                    .toDate()
                    .toLocaleTimeString()}`
                : "Hasn't been walked this morning yet"
            }
          />

          <CustomSwitch
            value={status.pm[0]}
            onValueChange={togglePmWalk}
            title="PM walk"
            text={
              status.pm[1]
                ? `Walked with ${status.pm[2]} at ${status.pm[1]
                    .toDate()
                    .toLocaleTimeString()}`
                : "Hasn't been walked this evening yet"
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.lightBlue,
  },
  sectionContainer: {
    height: "70%",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
});
