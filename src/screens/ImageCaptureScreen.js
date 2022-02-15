import { Alert, Button, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { useNavigation, useRoute } from "@react-navigation/native";

import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import globalColors from "../globalColors";

const ImageCaptureScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      try {
        setUploading(true);
        const modImage = await manipulateAsync(
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

        const url = await uploadImage(modImage.uri);
        const docRef = doc(db, "pets", route.params.petId);
        updateDoc(docRef, {
          imageUrl: url,
        }).then(() => navigation.popToTop());
      } catch (error) {
        Alert.alert(error.message);
        setUploading(false);
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
      {uploading ? (
        <ActivityIndicator animating={true} color={globalColors.blue} />
      ) : (
        <Button title="Pick an image from camera roll" onPress={pickImage} />
      )}
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
