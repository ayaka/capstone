import { Image, StyleSheet, Text, View, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { manipulateAsync } from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";

import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import globalStyles from "../globalStyles";
import globalColors from "../globalColors";

const CameraScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImageUri(data.uri);
    }
  };

  const saveImage = async () => {
    try {
      const modImage = await manipulateAsync(
        imageUri,
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
      }).then(() => navigation.goBack());
    } catch (error) {
      Alert.alert(error.message);
      setUploading(false);
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={globalStyles.container}>
      <View style={styles.topSpace}>
        {imageUri && (
          <View style={styles.imageSectionContainer}>
            <Pressable style={styles.imageContainer} onPress={saveImage}>
              <View style={styles.saveIcon}>
                <Ionicons name="save" color={globalColors.blue} size={30} />
              </View>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </Pressable>
          </View>
        )}
      </View>
      <Camera
        style={styles.camera}
        type={type}
        ratio={"1:1"}
        ref={(ref) => setCamera(ref)}
      ></Camera>

      <View style={styles.iconSectionContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate("ImageCapture", {
              petId: route.params.petId,
            })
          }
        >
          <Ionicons name="albums" color="#fff" size={45} />
        </Pressable>
        <Pressable onPress={takePhoto}>
          <Ionicons
            name="radio-button-on"
            color={globalColors.rose}
            size={70}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Ionicons name="camera-reverse" color="#fff" size={50} />
        </Pressable>
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    aspectRatio: 1,
  },
  iconSectionContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000",
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  imageContainer: {
    height: "80%",
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
  },
  imageSectionContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  saveIcon: {
    position: "absolute",
    top: "-10%",
    right: "-10%",
    zIndex: 5,
  },
  topSpace: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
  },
});
