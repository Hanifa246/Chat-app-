import { useNavigate } from 'react-router-dom';
import assets from '../../assets/assets';
import './LeftSidebar.css';
import { doc, getDocs, query, where, collection, setDoc, updateDoc, serverTimestamp, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const { userData, chatData, chatUser, setChatUser, setMessagesId, messagesId, chatVisible, setChatVisible } = useContext(AppContext);


  const inputHandler = async (e) => {
    try {
      const input = e.target.value.trim().toLowerCase();
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", "==", input));
      const querySnap = await getDocs(q);
      if (!querySnap.empty && userData && querySnap.docs[0].data().id !== userData.id) {
        let userExist = false;
        CharacterData.map((user)=>{
          if(user.rId === querySnap.docs[0].data().id){
            userExist = true;
          }
        })
        if(!userExist){
          setUser(querySnap.docs[0].data());
        }
      }
      else {
        setShowSearch(false);
      }
    } catch (error) {
    console.error("Error adding chat:", error);

    }
  }
  const addChat = async()=>{
    const messagesRef =collection(db,"messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, {
      createdAt: serverTimestamp(), 
      messages: []
        });
      await updateDoc(doc(chatsRef, user.id),{
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage:"",
          rId:userData.id,
          updateAt:Date.now(),
          messageSeen:true
        })
      })
      await updateDoc(doc(chatsRef, userData.id),{
          chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage:"",
          rId:user.id,
          updateAt:Date.now(),
          messageSeen:true
        })
      })

      const uSnap = await getDoc(doc(db,'users',user.id));
      const uData = uSnap.data();
      setChat({
        messagesId : newMessageRef.id,
        lastMessage:"",
        rId:user.id,
        updatedAt:Date.now(),
        messageSeen:true,
        userData:uData

      })
      setShowSearch(false)
      setChatVisible(true)
    } catch (error) {
      toast.error(error.message);
      console.error(error)
    }
  }
  const setChat = async (item) => {
  try {
    setMessagesId(item.messageId);
    setChatUser(item);

    const userChatsRef = doc(db, 'chats', userData.id);
    const userChatsSnapshot = await getDoc(userChatsRef);
    const userChatsData = userChatsSnapshot.data();
    const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId);
    userChatsData.chatsData[chatIndex].messageSeen = true;
    await updateDoc(userChatsRef, {
      chatsData: userChatsData.chatsData
    });
    setChatVisible(true);
  } catch (error) {
    toast.error(error.message);
  }
}

useEffect(() => {

  const updateChatUserData = async () => {
    if (chatUser) {
      const userRef = doc(db, "users", chatUser.userData.id);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setChatUser(prev => ({ ...prev, userData: userData }));
    }
  }

  updateChatUserData();
}, [chatData]);

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className='logo' alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder='Search Here....' />
        </div>
      </div>

      <div className="ls-list">
        {showSearch && user
        ?<div onClick={addChat} className='friends add-user'>
          <img src={user.avatar} alt="" />
          <p>{user.name}</p>
          </div>
          :chatData.map((item, index) => (
            <div 
              onClick={() => setChat(item)} 
              key={index} 
              className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}
            >            
            <img src={item.userData.avatar} alt="Profile" />
            <div>
              <p>{item.userData.name}</p>
              <span>{item.lastMessage}</span>
            </div>
          </div>
        ))
        }
        
      </div>
    </div>
  );
};

export default LeftSidebar;
