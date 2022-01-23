import { StyleSheet } from "react-native";

export default StyleSheet.create({
  button: {
    width: "60%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    margin: 15,
  },
  buttonSolid: {
    backgroundColor: "#0782f9",
  },
  buttonOutline: {
    backgroundColor: "#fff",
    borderColor: "#0782f9",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#0782f9",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonSolidText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 10,
  },
});
