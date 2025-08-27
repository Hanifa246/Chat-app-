//import React from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'
import { useContext, useEffect, useState } from 'react'

const RightSidebar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    let tempVar = [];
    (messages || []).map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });
    setMsgImages(tempVar);
  }, [messages]);

  // ✅ Safe function to handle both number and Firestore Timestamp
  const getLastSeenDiff = (lastSeen) => {
    if (!lastSeen) return Infinity;
    if (typeof lastSeen === "number") return Date.now() - lastSeen;
    if (lastSeen.toMillis) return Date.now() - lastSeen.toMillis();
    return Infinity;
  };

  return chatUser ? (
    <div className='rs'>
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {getLastSeenDiff(chatUser.userData.lastSeen) <= 70000 ? (
            <img className='dot' src={assets.green_dot} alt="" />
          ) : null}{" "}
          {chatUser.userData.name}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className='rs-media'>
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img onClick={() => window.open(url, "_blank")} key={index} src={url} alt="" />
          ))}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  ) : (
    <div className="rs">
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

export default RightSidebar;
