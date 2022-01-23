import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const CustomButton = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1.0 },
        props.buttonStyle,
      ]}
    >
      <Text style={props.buttonTextStyle}>{props.text}</Text>
    </Pressable>
  );
};

export default CustomButton;
