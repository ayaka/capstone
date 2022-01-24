import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRoute } from "@react-navigation/native";

const HomeScreen = () => {
  const route = useRoute();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const docRef = doc(db, "users", route.params.uid);
        const docSnap = await getDoc(docRef);
        setUser(docSnap.data());
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    loadInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* pet section */}
      {/* icon section */}
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
});
