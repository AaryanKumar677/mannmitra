import React, { useContext, useState, useEffect, useRef } from 'react'
import '../Main/Main.css'
import { assets } from '../../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, prevPrompts } = useContext(Context);
  
  // Theme state and function add karein
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  // Component mount par theme check karein
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Enter key handler function
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (input.trim() !== '' || selectedImage)) {
      handleSend();
    }
  };

  const handleCardClick = async (promptText) => {
    setInput(promptText);
    
    onSent(promptText, null);
  };

  // Image select handler
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Send button handler with image support
  const handleSend = () => {
    if (input.trim() !== '' || selectedImage) {
      onSent(input, selectedImage);
      setSelectedImage(null);
      
      // File input reset
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>MannMitra</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {showResult ?
          
        <div className="result">
            <div className='result-title'>
              <img src={assets.user_icon} alt="" />
              <div className="user-message">
                <p>{typeof recentPrompt === 'object' ? recentPrompt.text : recentPrompt}</p>
                {typeof recentPrompt === 'object' && recentPrompt.image && (
                  <div className="sent-image">
                    <img src={recentPrompt.image} alt="Sent by user" />
                  </div>
                )}
              </div>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading
                ? <div className="loader">
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                </div>
                : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              }
            </div>
          </div>
          : <>
            <div className="greet">
              <p><span>Hello, Aaryan</span></p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card" onClick={() => handleCardClick("Help me manage exam stress and anxiety")}>
                <p>Help me manage exam stress and anxiety</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card" onClick={() => handleCardClick("Help me calm my anxiety and worries")}>
                <p>Help me calm my anxiety and worries</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card" onClick={() => handleCardClick("Please suggest a daily mental wellness routine")}>
                <p>Please suggest a daily mental wellness routine</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card" onClick={() => handleCardClick("Please suggest some self-care activities for today")}>
                <p>Please suggest some self-care activities for today</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        }

        {/* Selected image preview */}
        {selectedImage && (
          <div className="preview-container">
            <div className="image-preview">
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
              <button onClick={removeImage} className="remove-image-btn">×</button>
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            {/* Theme Toggle Button */}
            <button 
                className="theme-toggle-btn" 
                onClick={toggleTheme}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '5px',
                    marginRight: '10px'
                }}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Hidden file input */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect} 
              ref={fileInputRef}
              style={{ display: 'none' }} 
              id="file-input"
            />
            
            {/* Updated input with Enter key support */}
            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text" 
              placeholder="Enter a prompt here"
              onKeyPress={handleKeyPress}
            />
            <div>
                {/* Gallery icon pe click handler add karein */}
                <img 
                  src={assets.gallery_icon} 
                  width={30} 
                  alt="" 
                  onClick={() => document.getElementById('file-input').click()}
                  style={{ cursor: 'pointer' }}
                />
                <img src={assets.mic_icon} width={30} alt="" />
                {(input || selectedImage) ? 
                  <img onClick={handleSend} src={assets.send_icon} width={30} alt="" style={{ cursor: 'pointer' }} /> 
                  : null
                }
            </div>
          </div>
          <p className="bottom-info">
            MannMitra may display inaccurate info, including about people, so double-check its responses. Your privacy and MannMitra Apps
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main