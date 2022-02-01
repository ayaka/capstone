import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

import globalColors from "../globalColors";
import CustomIcon from "../components/CustomIcon";

const HomeScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const user = route.params.user;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "pets", user.petId), (doc) => {
      setPet(doc.data());
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return loading ? (
    <SafeAreaView style={styles.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text>{pet.name}</Text>
      </View>
      <View style={styles.iconContainer}>
        <CustomIcon
          onPress={() => navigation.navigate("Food", { petId: pet.id })}
          text="Meals & Snacks"
        />
        <CustomIcon
          onPress={() =>
            navigation.navigate({ name: "Location", params: { petId: pet.id } })
          }
          text="Inside / Outside"
        />
        <CustomIcon text="Walk" />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: globalColors.blue,
  },
  mainContainer: {
    flex: 4,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
