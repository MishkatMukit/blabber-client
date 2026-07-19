// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4nJ5I-H5q96DXAeV3IJqfCS3MeWP2qf4",
  authDomain: "blabber404.firebaseapp.com",
  projectId: "blabber404",
  storageBucket: "blabber404.firebasestorage.app",
  messagingSenderId: "466083009124",
  appId: "1:466083009124:web:435d1cc37bb54bad0d4571"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)