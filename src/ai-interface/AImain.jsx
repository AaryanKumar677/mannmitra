// src/ai-interface/AImain.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './AIApp.jsx';
import './Aindex.css';
import ContextProvider from './context/Context.jsx';
import { AuthProvider } from '../context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
