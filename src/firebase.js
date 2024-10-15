// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGBcLLLoFd_DSgPN2A1A1hlkE34uhpEYg",
  authDomain: "personal-finance-manager-14eff.firebaseapp.com",
  projectId: "personal-finance-manager-14eff",
  storageBucket: "personal-finance-manager-14eff.appspot.com",
  messagingSenderId: "580858218168",
  appId: "1:580858218168:web:8b333afa3a695e5f89164d",
  measurementId: "G-1PMRQRDF4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export { GoogleAuthProvider };