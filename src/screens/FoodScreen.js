import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton, RadioButton } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

import { db } from "../firebase";
import { doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

import CustomSwitch from "../components/CustomSwitch";
import globalStyles from "../globalStyles";
import globalColors from "../globalColors";

const FoodScreen = () => {
  const route = useRoute();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const docRef = doc(db, "pets", route.params.petId);
  const userName = route.params.userName;

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setFood(doc.data().food);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const checkLeftover = async (value) => {
    await updateDoc(docRef, {
      "food.leftover": [value, Timestamp.now(), userName],
    });
  };

  const toggleBreakfast = async () => {
    food.breakfast[0]
      ? await updateDoc(docRef, { "food.breakfast": [false, null, null] })
      : await updateDoc(docRef, {
          "food.breakfast": [true, Timestamp.now(), userName],
        });
  };

  const toggleDinner = async () => {
    food.dinner[0]
      ? await updateDoc(docRef, { "food.dinner": [false, null, null] })
      : await updateDoc(docRef, {
          "food.dinner": [true, Timestamp.now(), userName],
        });
  };

  const toggleTreat = async () => {
    food.treat[0]
      ? await updateDoc(docRef, { "food.treat": [false, null, null] })
      : await updateDoc(docRef, {
          "food.treat": [true, Timestamp.now(), userName],
        });
  };

  const addTreatCounts = async () => {
    await updateDoc(docRef, { "food.extraTreats": ++food.extraTreats });
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.sectionContainer}>
          <View style={globalStyles.statusContainer}>
            <Text style={styles.title}>Leftover</Text>
            <View style={styles.radioButtonContainer}>
              <Text style={styles.text}>No</Text>
              <RadioButton
                value="No"
                color={globalColors.brown}
                status={food.leftover[0] === false ? "checked" : "unchecked"}
                onPress={() => checkLeftover(false)}
              />
              <Text style={styles.text}>Yes</Text>
              <RadioButton
                value="Yes"
                color={globalColors.brown}
                status={food.leftover[0] === true ? "checked" : "unchecked"}
                onPress={() => checkLeftover(true)}
              />
            </View>
            <Text style={styles.text}>
              {food.leftover[1] === null
                ? "Not checked yet"
                : `Checked at ${food.leftover[1]
                    .toDate()
                    .toLocaleTimeString()}`}
            </Text>
          </View>

          <CustomSwitch
            value={food.breakfast[0]}
            onValueChange={toggleBreakfast}
            title="Breakfast"
            text={
              food.breakfast[1]
                ? `Given by ${food.breakfast[2]} at ${food.breakfast[1]
                    .toDate()
                    .toLocaleTimeString()}`
                : "Not given yet"
            }
          />

          <CustomSwitch
            value={food.dinner[0]}
            onValueChange={toggleDinner}
            title="Dinner"
            text={
              food.dinner[1]
                ? `Given by ${food.dinner[2]} at ${food.dinner[1]
                    .toDate()
                    .toLocaleTimeString()}`
                : "Not given yet"
            }
          />

          <CustomSwitch
            value={food.treat[0]}
            onValueChange={toggleTreat}
            title="Treat"
            text={
              food.treat[1]
                ? `Given by ${food.treat[2]} at ${food.treat[1]
                    .toDate()
                    .toLocaleTimeString()}`
                : "Not given yet"
            }
          />

          <View style={globalStyles.statusContainer}>
            <Text style={styles.title}>Extra Treats</Text>
            <View style={styles.treatCountContainer}>
              <Text style={[styles.title, styles.treatCount]}>
                {food.extraTreats}
              </Text>
              <IconButton
                icon="plus"
                style={styles.icon}
                color={globalColors.brown}
                size={30}
                onPress={addTreatCounts}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FoodScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.lightBlue,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  sectionContainer: {
    height: "90%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  text: {
    color: globalColors.brown,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: globalColors.brown,
  },
  treatCount: {
    fontSize: 20,
    margin: 10,
  },
  treatCountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
