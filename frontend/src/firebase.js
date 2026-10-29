import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9iHhMAdYwfbCaKz7rvhTPiouoiVwiTZQ",
  authDomain: "rohit-food-junction.firebaseapp.com",
  projectId: "rohit-food-junction",
  storageBucket: "rohit-food-junction.firebasestorage.app",
  messagingSenderId: "145054974738",
  appId: "1:145054974738:web:237852d6a03ef2810429cb",
};

const app = initializeApp(firebaseConfig);

// Customer and existing app authentication — unchanged.
export const auth = getAuth(app);

// Separate Firebase Auth instance for Manager sessions.
export const managerAuth = getAuth(
  initializeApp(firebaseConfig, "rfj-manager-auth")
);

// Persistence settings are exported for the corresponding login flows.
export const customerAuthPersistence = browserLocalPersistence;
export const managerAuthPersistence = browserSessionPersistence;

export { setPersistence };

export default app;