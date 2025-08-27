import { initializeApp } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  collection, 
  doc,
  getDocs,   // ✅ added for queries
  getFirestore,
  query,
  setDoc, 
  where 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";   // ✅ for image upload
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAOLTD0Fgmb_9FQG_ObSfaVljYFJucJ-3o",
  authDomain: "chat-app-gs-5051b.firebaseapp.com",
  projectId: "chat-app-gs-5051b",
  storageBucket: "chat-app-gs-5051b.firebasestorage.app",
  messagingSenderId: "90560200375",
  appId: "1:90560200375:web:3f9ae10df8a05f57e59732"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);   // ✅ storage initialized

const signup = async (username,email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name:"",
      avatar: "",
      bio:"",
      lastSeen:Date.now()
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatsData:[],
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }       
}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef = collection(db, 'users');
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);   // ✅ fixed getDocs

    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset Email Sent");
    }
    else {
      toast.error("Email doesn't exist");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

// ✅ Added upload function for ChatBar.jsx
const upload = async (file) => {
  const fileRef = ref(storage, `images/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export { signup, login, logout, auth, db, resetPass, upload };
