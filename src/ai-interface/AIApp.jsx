import React, { useState } from 'react'
import Sidebar from '../ai-interface/ai-component/Sidebar/Sidebar'
import Main from '../ai-interface/ai-component/Main/Main'
import Booking from './ai-component/Booking/Booking'
import Resources from './ai-component/Resources/Resources'
import Dashboard from './ai-component/Dashboard/Dashboard'

const AIApp = () => {
  const [activePage, setActivePage] = useState("chat");  

  const renderPage = () => {
    switch (activePage) {
      case "chat":
        return <Main />;
      case "booking":
        return <Booking />;
      case "resources":
        return <Resources />;
      case "dashboard":
        return <Dashboard />;
      default:
        return <Main />;
    }
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar setActivePage={setActivePage} style={{ width: "250px" }} />
      
      <div style={{ flex: 1, overflowY: "auto" }}>
        {renderPage()}
      </div>
    </div>
  )
}

export default AIApp
