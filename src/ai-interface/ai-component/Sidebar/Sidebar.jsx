import React, { useContext, useState, useEffect } from 'react'
import '../Sidebar/Sidebar.css'
import { assets } from '../../../assets/assets'
import { Context } from '../../context/Context';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    // const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);
    const { conversations, setCurrentChatId, newChat } = useContext(Context);
    

    // useEffect(() => {
    //     const groups = [];
    //     let currentGroup = [];
        
    //     prevPrompts.forEach((item, index) => {
            
    //         if (item.type === 'user') {
                
    //             if (currentGroup.length > 0) {
    //                 groups.push([...currentGroup]);
    //             }
    //             currentGroup = [item];
    //         } 
            
    //         else if (item.type === 'ai' && currentGroup.length > 0) {
    //             currentGroup.push(item);
    //             groups.push([...currentGroup]);
    //             currentGroup = [];
    //         }
            
    //         else {
    //             currentGroup.push(item);
    //         }
    //     });

        
    //     if (currentGroup.length > 0) {
    //         groups.push(currentGroup);
    //     }

    //     setConversationGroups(groups);
    // }, [prevPrompts]);

    // const loadConversation = async (conversation) => {
        
    //     const userMessage = conversation.find(msg => msg.type === 'user');
    //     if (userMessage) {
    //         await onSent(userMessage.text);
    //         setRecentPrompt(userMessage.text);
    //     }
    // }
    const loadConversation = (chatId) => {
        setCurrentChatId(chatId); // ✅ existing chat open karo
    };

    return (
    <div className='sidebar'>
      <div className="top">
        <img
          src={assets.menu_icon}
          alt=""
          className="menu"
          onClick={() => setExtended(prev => !prev)}
        />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>

        {extended && (
          <div className="recent">
            <p className='recent-title'>Recent Chat</p>
            {conversations.map(chat => (
              <div
                key={chat.id}
                onClick={() => loadConversation(chat.id)}
                className="recent-entry"
              >
                <img src={assets.message_icon} alt="" />
                <p>{chat.title.slice(0, 18)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
}

export default Sidebar