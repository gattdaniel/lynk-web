// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADMQ_yJhB0A1b2sNEIhcn7YJhr7gZhu2E",
  authDomain: "lynk-d2fb7.firebaseapp.com",
  projectId: "lynk-d2fb7",
  storageBucket: "lynk-d2fb7.firebasestorage.app",
  messagingSenderId: "799981742408",
  appId: "1:799981742408:web:9fed47cf8a79b923632b7d",
  measurementId: "G-KBDHZRXCR2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { db, auth}