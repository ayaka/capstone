import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import globalColors from "../globalColors";

const CustomIcon = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }, styles.icon]}
    >
      <Text style={styles.text}>{props.text1}</Text>
      <Text style={styles.text}>{props.text2}</Text>
    </Pressable>
  );
};

export default CustomIcon;

const styles = StyleSheet.create({
  icon: {
    width: "47.5%",
    aspectRatio: 1,
    // borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.blue,
    // backgroundColor: "#86e7b8",
  },
  text: {
    color: globalColors.olive,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
