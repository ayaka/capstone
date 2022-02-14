// import { FIREBASE_API_KEY } from "@env";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "capstone-4d645.firebaseapp.com",
  projectId: "capstone-4d645",
  storageBucket: "capstone-4d645.appspot.com",
  messagingSenderId: "588506380822",
  appId: "1:588506380822:web:5b89ced6193e8f63b55337",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const db = getFirestore();

export const storage = getStorage();
