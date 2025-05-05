// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtCUCfXMaTC_nW1qwfsvcuHaZUSRALUek",
  authDomain: "login-auth-2ddd5.firebaseapp.com",
  projectId: "login-auth-2ddd5",
  storageBucket: "login-auth-2ddd5.firebasestorage.app",
  messagingSenderId: "135693142305",
  appId: "1:135693142305:web:9564b60df7f419f55fd660",
  measurementId: "G-196RQXG2SW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth();
export default app;