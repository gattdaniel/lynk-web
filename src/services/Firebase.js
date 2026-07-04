// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- ajouter ceci

const firebaseConfig = {
  apiKey: "AIzaSyADMQ_yJhB0A1b2sNEIhcn7YJhr7gZhu2E",
  authDomain: "lynk-d2fb7.firebaseapp.com",
  projectId: "lynk-d2fb7",
  storageBucket: "lynk-d2fb7.appspot.com", // <-- vérifier le format correct
  messagingSenderId: "799981742408",
  appId: "1:799981742408:web:9fed47cf8a79b923632b7d",
  measurementId: "G-KBDHZRXCR2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // <-- ajouter ceci

export { auth, db, storage }; // <-- exporter storage
