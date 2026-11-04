import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDjzdgpkmCW0FqbYtUyxKeT_8Jf5BEetwo",
  authDomain: "sistema-de-chamados-b76b9.firebaseapp.com",
  projectId: "sistema-de-chamados-b76b9",
  storageBucket: "sistema-de-chamados-b76b9.firebasestorage.app",
  messagingSenderId: "1069967945901",
  appId: "1:1069967945901:web:b4f834e571d705852a5624"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };