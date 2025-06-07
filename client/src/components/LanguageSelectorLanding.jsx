import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const languages = [
  { code: "en", name: "English" },
  { code: "fil", name: "Filipino" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "km", name: "ខ្មែរ" },
  { code: "my", name: "မြန်မာ" },
  { code: "zh", name: "中文" },
  { code: "hi", name: "हिंदी" },
  { code: "ta", name: "தமிழ்" },
  { code: "jv", name: "Basa Jawa" },
  { code: "bn", name: "বাংলা" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "te", name: "తెలుగు" }
];

const LanguageSelectorLanding = ({ onLanguageSelect }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return sessionStorage.getItem("preferredLanguage") || "en";
  });

  useEffect(() => {
    // Set English as default on initial load if no language is stored
    if (!sessionStorage.getItem("preferredLanguage")) {
      sessionStorage.setItem("preferredLanguage", "en");
      i18n.changeLanguage("en");
      onLanguageSelect("en");
    }
  }, []);

  const handleLanguageSelect = (langCode) => {
    sessionStorage.setItem("preferredLanguage", langCode);
    setSelectedLanguage(langCode);
    i18n.changeLanguage(langCode);
    onLanguageSelect(langCode);
  };

  const handleSubmit = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#E3EEB2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#332D56] mb-4">
            🌏 {t("choose_language")}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`p-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${
                selectedLanguage === lang.code
                  ? "bg-[#332D56] text-[#E3EEB2] shadow-lg"
                  : "bg-[#71C0BB] text-[#332D56] hover:bg-[#4E6688] hover:text-[#E3EEB2] shadow-md"
              }`}
            >
              <div className="font-medium text-lg">{lang.name}</div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-[#E3EEB2] bg-[#4E6688] hover:bg-[#332D56] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4E6688] transition-colors duration-200 shadow-lg"
          >
            {t("save_and_continue")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorLanding;
