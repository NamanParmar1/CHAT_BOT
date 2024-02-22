
// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
 
const firebaseConfig = {
  apiKey: "AIzaSyBpfMsPTnAKZKmA6PxPG2DRWjjlGgbf8GA",
  authDomain: "bothero-fbe1c.firebaseapp.com",
  projectId: "bothero-fbe1c",
  storageBucket: "bothero-fbe1c.appspot.com",
  messagingSenderId: "205496723921",
  appId: "1:205496723921:web:67d9423f11ec8540a018f0"
};
 
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 
export default db;