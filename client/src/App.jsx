import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LanguageSelectorLanding from './components/LanguageSelectorLanding';
import UserProfileForm from './components/UserProfileForm';
import MainContent from './components/MainContent';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';

function App() {
  const [messages, setMessages] = useState(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleProfileSubmit = (profileData) => {
    console.log("Profile submitted:", profileData);
    // In a real application, you might save this to a global state or context
  };

  const handleLanguageSelection = (langCode) => {
    console.log("Language selected:", langCode);
    // You might store this in a global state or context as well
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Landing page as the main entry point */}
          <Route path="/" element={
            <div>
              <Navbar />
              <LandingPage />
            </div>
          } />
          
          {/* Other routes */}
          <Route path="/language-selector" element={
            <div>
              <Navbar />
              <LanguageSelectorLanding onLanguageSelect={handleLanguageSelection} />
            </div>
          } />
          <Route path="/profile" element={
            <div>
              <Navbar />
              <UserProfileForm onProfileSubmit={handleProfileSubmit} />
            </div>
          } />
          <Route path="/main" element={
            <div>
              <Navbar />
              <MainContent messages={messages} setMessages={setMessages} />
            </div>
          } />
          
          {/* Redirect any unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;












