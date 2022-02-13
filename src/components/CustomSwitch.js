import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Switch } from "react-native-paper";

import globalStyles from "../globalStyles";
import globalColors from "../globalColors";

const CustomSwitch = (props) => {
  return (
    <View style={globalStyles.statusContainer}>
      <Text style={styles.title}>{props.title}</Text>
      <Switch
        style={styles.switch}
        value={props.value}
        onValueChange={props.onValueChange}
        color={globalColors.brown}
      />
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  switch: {
    margin: 10,
  },
  text: {
    color: globalColors.brown,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: globalColors.brown,
  },
});
