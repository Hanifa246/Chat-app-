import { useContext, useState, useEffect } from "react"; 
import ChatBar from '../../components/ChatBar/ChatBar'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import RightSidebar from '../../components/RightSidebar/RightSidebar'
import './Chat.css'
import { AppContext } from '../../context/AppContext'

const Chat = () => {
  const { chatData, userData } = useContext(AppContext); 
  const [loading, setLoading] = useState(true);          

  useEffect(() => {
    // when chatData and userData are ready, stop loading
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);

  return (
    <div className='chat'>
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <div className="chat-container">
          <LeftSidebar />
          <ChatBar />
          <RightSidebar />
        </div>
      )}
    </div>
  )
}

export default Chat;
