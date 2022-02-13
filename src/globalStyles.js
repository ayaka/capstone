import { StyleSheet } from "react-native";
import globalColors from "./globalColors";

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
    backgroundColor: globalColors.blue,
  },
  buttonOutline: {
    backgroundColor: "#fff",
    borderColor: globalColors.blue,
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: globalColors.blue,
    fontWeight: "700",
    fontSize: 16,
  },
  buttonSolidText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 10,
    color: globalColors.brown,
  },
  statusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
