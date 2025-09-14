import React, { useContext, useState, useEffect } from 'react'
import '../Sidebar/Sidebar.css'
import { assets } from '../../../assets/assets'
import { Context } from '../../context/Context';

const Sidebar = ({ setActivePage }) => {   // 👈 naye prop for navigation
    const [extended, setExtended] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { conversations, setCurrentChatId, newChat, isLightMode } = useContext(Context);
    
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        if(isMobile) {
            if(isLightMode) {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        } else {
            document.body.classList.remove('light-mode');
        }
    }, [isLightMode, isMobile]);

    const loadConversation = (chatId) => {
        setCurrentChatId(chatId);
        if (isMobile) {
            closeMobileSidebar();
        }
        setActivePage("chat"); // 👈 when chat is clicked
    };

    const handleNewChat = () => {
        newChat();
        if (isMobile) {
            closeMobileSidebar();
        }
        setActivePage("chat"); // 👈 new chat goes to chat page
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    return (
        <>
            {isMobile && !isMobileSidebarOpen && (
                <div className="mobile-menu-icon" onClick={toggleMobileSidebar}>
                    <img src={assets.menu_icon} alt="Menu" />
                </div>
            )}
            
            {isMobile && (
                <div 
                    className={`overlay ${isMobileSidebarOpen ? 'active' : ''}`} 
                    onClick={closeMobileSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`sidebar ${isMobileSidebarOpen ? 'active' : ''}`}>
                <div className="top">
                    <img
                        src={assets.menu_icon}
                        alt=""
                        className="menu"
                        onClick={() => {
                            if (isMobile) {
                                toggleMobileSidebar();
                            } else {
                                setExtended(prev => !prev);
                            }
                        }}    
                    />

                    <div className="features">
                        <div className="bottom-item recent-entry" onClick={() => setActivePage("chat")}>
                            <img src={assets.message_icon} alt="" />
                            {extended ? <p>Chatbot</p> : null}
                        </div>
                        <div className="bottom-item recent-entry" onClick={() => setActivePage("booking")}>
                            <img src={assets.booking_icon} alt="" />
                            {extended ? <p>Booking</p> : null}
                        </div>
                        <div className="bottom-item recent-entry" onClick={() => setActivePage("resources")}>
                            <img src={assets.resources_icon} alt="" />
                            {extended ? <p>Resources</p> : null}
                        </div>
                        <div className="bottom-item recent-entry" onClick={() => setActivePage("dashboard")}>
                            <img src={assets.dashboard_icon} alt="" />
                            {extended ? <p>Dashboard</p> : null}
                        </div>
                    </div>

                    
                    <div onClick={handleNewChat} className="new-chat">
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
                    {/* Old Items */}
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
        </>
    );
}

export default Sidebar;
                                                                                                                                                                                                                                   