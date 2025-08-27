//import React from 'react'

import Login from "./pages/Login/Login"
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate"
import Chat from "./pages/Chat/Chat"
import { Route, Routes, useNavigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { AppContext } from "./context/AppContext";  // ✅ import your context

const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext); // ✅ FIXED useContext

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user); // ✅ call context method if needed
        navigate("/chat");
        console.log(user);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe(); // ✅ cleanup listener
  }, [navigate, loadUserData]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
      </Routes>
    </>
  );
};

export default App;
