import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import globalColors from "../globalColors";

const CustomIcon = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }, styles.icon]}
    >
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
};

export default CustomIcon;

const styles = StyleSheet.create({
  icon: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.while,
  },
  text: {
    color: globalColors.blue,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
