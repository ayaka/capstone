import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Switch } from "react-native-paper";

import globalStyles from "../globalStyles";

const CustomSwitch = (props) => {
  return (
    <View style={globalStyles.statusContainer}>
      <Text style={styles.title}>{props.title}</Text>
      <Switch
        style={styles.switch}
        value={props.value}
        onValueChange={props.onValueChange}
      />
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  switch: { margin: 10 },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },
});
