import { getDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { createContext, useState } from "react";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";   // make sure db is exported from firebase.js

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);

const loadUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = { id: uid, ...userSnap.data() }; // ✅ include id
      setUserData(userData);

      // Update lastSeen immediately
      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });

      // Update lastSeen every 60s if user is still logged in
      const intervalId = setInterval(async () => {
        if (auth.currentUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);

      return userData; 
    } else {
      console.warn("No user document found for uid:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    return null;
  }
};

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data()?.chatsData || [];

        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const uData = userSnap.data();
          tempData.push({ ...item, userData: uData });
        }
        setChatData(tempData.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
      });
      return () => {
        unSub();
      };
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
