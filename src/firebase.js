// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth,GoogleAuthProvider } from "firebase/auth";
// const firebaseConfig = {
//   apiKey: "AIzaSyAGBcLLLoFd_DSgPN2A1A1hlkE34uhpEYg",
//   authDomain: "personal-finance-manager-14eff.firebaseapp.com",
//   projectId: "personal-finance-manager-14eff",
//   storageBucket: "personal-finance-manager-14eff.appspot.com",
//   messagingSenderId: "580858218168",
//   appId: "1:580858218168:web:8b333afa3a695e5f89164d",
//   measurementId: "G-1PMRQRDF4S"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const auth = getAuth(app);
// export { GoogleAuthProvider };

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGBcLLLoFd_DSgPN2A1A1hlkE34uhpEYg",
  authDomain: "personal-finance-manager-14eff.firebaseapp.com",
  projectId: "personal-finance-manager-14eff",
  storageBucket: "personal-finance-manager-14eff.firebasestorage.app",
  messagingSenderId: "580858218168",
  appId: "1:580858218168:web:8b333afa3a695e5f89164d",
  measurementId: "G-1PMRQRDF4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore and export
export const storage = getStorage(app);
export { GoogleAuthProvider };
