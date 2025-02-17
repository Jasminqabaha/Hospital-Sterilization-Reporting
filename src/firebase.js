import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAOmx-p4NIOrc3yWB2q7U0PuKfOHeXZ24U",
  authDomain: "hospital-reporting.firebaseapp.com",
  databaseURL: "https://hospital-reporting-default-rtdb.firebaseio.com",
  projectId: "hospital-reporting",
  storageBucket: "hospital-reporting.firebasestorage.app",
  messagingSenderId: "545026619949",
  appId: "1:545026619949:web:7b040438d7ba0ffaf2d6a4",
  measurementId: "G-EYWE53QK1D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const realtimeDb = getDatabase(app);
export const firestoreDb = getFirestore(app);