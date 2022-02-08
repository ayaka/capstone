import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useNavigation, useRoute } from "@react-navigation/native";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const ImageCaptureScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      try {
        const compressedImage = await manipulateAsync(
          result.uri,
          [
            {
              resize: {
                height: 300,
              },
            },
          ],
          {
            compress: 1,
          }
        );

        const url = await uploadImage(compressedImage.uri);
        console.log(url);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const uploadImage = async (uri) => {
    const imageRef = ref(storage, `${route.params.petId}`);

    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadTask = await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {/* {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )} */}
    </View>
  );
};

export default ImageCaptureScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
});
