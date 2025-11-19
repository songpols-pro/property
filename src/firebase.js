import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVIdDDLkSBtmf3yHRkt5ysDOn83Vxlkxc",
  authDomain: "property-renohome.firebaseapp.com",
  projectId: "property-renohome",
  storageBucket: "property-renohome.firebasestorage.app",
  messagingSenderId: "642196361218",
  appId: "1:642196361218:web:21917c171057f05378971b",
  measurementId: "G-0ZMLTLFQJM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
