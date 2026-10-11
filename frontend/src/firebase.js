import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9iHhMAdYwfbCaKz7rvhTPiouoiVwiTZQ",
  authDomain: "rohit-food-junction.firebaseapp.com",
  projectId: "rohit-food-junction",
  storageBucket: "rohit-food-junction.firebasestorage.app",
  messagingSenderId: "145054974738",
  appId: "1:145054974738:web:237852d6a03ef2810429cb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;