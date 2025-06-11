import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from './InputForm';
import OutputDisplay from './OutputDisplay';

function MainContent({ messages, setMessages }) {
    const [localizedContent, setLocalizedContent] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [preferredLanguage, setPreferredLanguage] = useState('');
    const [showOutputFirst, setShowOutputFirst] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedProfile = sessionStorage.getItem('userProfile');
        const storedLanguage = sessionStorage.getItem('preferredLanguage');
        
        if (!storedLanguage) {
            navigate('/language-selector');
            return;
        }
        
        if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
        }
        
        setPreferredLanguage(storedLanguage);
    }, [navigate]);

    const handleSwapPanels = () => {
        setShowOutputFirst(prev => !prev);
    };

    if (!preferredLanguage) {
        return null;
    }

    return (
        <div className="relative flex flex-col md:flex-row p-6 gap-6 h-[calc(100vh-80px)]">
            {/* Floating Swap Button */}
            <button 
                onClick={handleSwapPanels}
                className="fixed bottom-8 right-8 z-50 bg-[#4E6688] text-[#E3EEB2] px-4 py-2 rounded-lg hover:bg-[#332D56] transition-colors shadow-md flex items-center space-x-2"
                title="Swap Panels"
            >
                ↔️ 
            </button>

            {showOutputFirst ? (
                <>
                    <OutputDisplay 
                        localizedContent={localizedContent} 
                        language={preferredLanguage}
                    />
                    <InputForm 
                        setLocalizedContent={setLocalizedContent} 
                        userProfile={userProfile}
                        preferredLanguage={preferredLanguage}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </>
            ) : (
                <>
                    <InputForm 
                        setLocalizedContent={setLocalizedContent} 
                        userProfile={userProfile}
                        preferredLanguage={preferredLanguage}
                        messages={messages}
                        setMessages={setMessages}
                    />
                    <OutputDisplay 
                        localizedContent={localizedContent} 
                        language={preferredLanguage}
                    />
                </>
            )}
        </div>
    );
}

export default MainContent;
