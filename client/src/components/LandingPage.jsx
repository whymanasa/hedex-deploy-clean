import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function LandingPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleTryIt = () => {
        navigate('/language-selector');
    };

    return (
        <div className="min-h-screen bg-[#E3EEB2] flex items-center justify-center p-4">
            <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Image Section */}
                <div className="md:w-1/2 h-64 md:h-auto">
                    <img
                        src="8598334.jpg"
                        alt="Education Technology"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Text Section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center items-start text-center md:text-left bg-[#71C0BB]">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#332D56] mb-4">
                        Built for me
                    </h1>
                    <p className="text-lg md:text-xl text-[#4E6688] mb-6">
                        Hex localizer Transforms education by localizing content and valuing every student's unique language and culture.
                    </p>
                    <button
                        onClick={handleTryIt}
                        className="bg-[#4E6688] hover:bg-[#332D56] text-[#E3EEB2] font-semibold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                    >
                        {t('try_it')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
