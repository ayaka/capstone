import { Pressable, StyleSheet } from "react-native";
import React from "react";

import globalColors from "../globalColors";

const CustomIcon = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1.0 },
        { shadowColor: globalColors.black },
        { shadowOpacity: pressed ? 0 : 0.5 },
        { shadowOffset: { width: 0, height: 5 } },
        { shadowRadius: 5 },
        { elevation: pressed ? 0 : 10 },
        styles.icon,
      ]}
    >
      {props.image}
    </Pressable>
  );
};

export default CustomIcon;

const styles = StyleSheet.create({
  icon: {
    width: "47.5%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: globalColors.lightBlue2,
    borderColor: "gray",
  },
});
