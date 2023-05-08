import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyDSLALPGBivg-l_3Ok1j-G-SJUtpiil6Do",
  authDomain: "petopia-cs554.firebaseapp.com",
  projectId: "petopia-cs554",
  storageBucket: "petopia-cs554.appspot.com",
  messagingSenderId: "471026115514",
  appId: "1:471026115514:web:93d0ffcf88ab2000157383"
};

const app = firebase.initializeApp(firebaseConfig);
export default app;