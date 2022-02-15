import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import { StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginScreen from "./src/screens/LoginScreen";
import GreetingScreen from "./src/screens/GreetingScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LocationScreen from "./src/screens/LocationScreen";
import ImageCaptureScreen from "./src/screens/ImageCaptureScreen";
import CameraScreen from "./src/screens/CameraScreen";
import FoodScreen from "./src/screens/FoodScreen";
import globalColors from "./src/globalColors";
import ProfileScreen from "./src/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Greeting">
            <Stack.Screen
              name="Greeting"
              component={GreetingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: "Log In",
                headerTintColor: globalColors.brown,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: "Register",
                headerTintColor: globalColors.brown,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="Main"
              component={DrawerRoutes}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Food"
              component={FoodScreen}
              options={{
                title: "Food / Snack Status",
                headerStyle: {
                  backgroundColor: globalColors.white,
                },
                headerTintColor: globalColors.brown,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="Location"
              component={LocationScreen}
              options={{
                title: "Backyard / Walk Status",
                headerStyle: {
                  backgroundColor: globalColors.white,
                },
                headerTintColor: globalColors.brown,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="Camera"
              component={CameraScreen}
              options={{
                headerTintColor: globalColors.brown,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="ImageCapture"
              component={ImageCaptureScreen}
              options={{
                title: "Camera Roll",
                headerTintColor: globalColors.brown,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

// const styles = StyleSheet.create({});
