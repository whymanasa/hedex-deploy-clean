import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SEA_LANGUAGES = [
  { code: "bn", name: "বাংলা", country: "Regional" },
  { code: "zh", name: "中文", country: "Major" },
  { code: "zh-hk", name: "廣東話", country: "Major" },
  { code: "zh-tw", name: "繁體中文", country: "Major" },
  { code: "en", name: "English", country: "Major" },
  { code: "fil", name: "Filipino", country: "Philippines" },
  { code: "hi", name: "हिंदी", country: "Regional" },
  { code: "id", name: "Bahasa Indonesia", country: "Indonesia" },
  { code: "jv", name: "Javanese", country: "Indonesia" },
  { code: "km", name: "ខ្មែរ", country: "Cambodia" },
  { code: "lo", name: "ພາສາລາວ", country: "Laos" },
  { code: "ms", name: "Bahasa Melayu", country: "Malaysia" },
  { code: "my", name: "မြန်မာ", country: "Myanmar" },
  { code: "pa", name: "ਪੰਜਾਬੀ", country: "Regional" },
  { code: "ta", name: "தமிழ்", country: "Malaysia" },
  { code: "te", name: "తెలుగు", country: "Regional" },
  { code: "th", name: "ไทย", country: "Thailand" },
  { code: "tl", name: "Tagalog", country: "Philippines" },
  { code: "ur", name: "اردو", country: "Regional" },
  { code: "vi", name: "Tiếng Việt", country: "Vietnam" }


].sort((a, b) => a.name.localeCompare(b.name));

const UserProfileForm = ({ onProfileSubmit }) => {
  const { t } = useTranslation();
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = sessionStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: "",
      age: "",
      interests: "",
      preferredLanguage: sessionStorage.getItem('preferredLanguage') || "en"
    };
  });
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProfileSubmit(profileData);
    sessionStorage.setItem("userProfile", JSON.stringify(profileData));
    sessionStorage.setItem("preferredLanguage", profileData.preferredLanguage);
    navigate("/main");
  };

  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return SEA_LANGUAGES;
    const searchLower = searchTerm.toLowerCase();
    return SEA_LANGUAGES.filter(lang => 
      lang.name.toLowerCase().includes(searchLower) || 
      lang.country.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  const groupedLanguages = useMemo(() => {
    const groups = {};
    filteredLanguages.forEach(lang => {
      if (!groups[lang.country]) {
        groups[lang.country] = [];
      }
      groups[lang.country].push(lang);
    });
    return groups;
  }, [filteredLanguages]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E3EEB2] p-4">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-[#332D56] mb-6 text-center">
          {t("your_profile")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={t("name")}
            value={profileData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#71C0BB] rounded-lg focus:ring-2 focus:ring-[#4E6688] focus:border-transparent outline-none transition-all duration-200"
            required
          />
          <input
            type="number"
            name="age"
            placeholder={t("age")}
            value={profileData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#71C0BB] rounded-lg focus:ring-2 focus:ring-[#4E6688] focus:border-transparent outline-none transition-all duration-200"
            required
          />
          <input
            type="text"
            name="interests"
            placeholder={t("interests")}
            value={profileData.interests}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#71C0BB] rounded-lg focus:ring-2 focus:ring-[#4E6688] focus:border-transparent outline-none transition-all duration-200"
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4E6688]">
              {t("select_language")}
            </label>
            <p className="text-sm text-[#4E6688] mb-2">
              {t("language_description")}
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder={t("search_languages")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[#71C0BB] rounded-lg mb-2 focus:ring-2 focus:ring-[#4E6688] focus:border-transparent outline-none transition-all duration-200"
              />
              <select
                name="preferredLanguage"
                value={profileData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#71C0BB] rounded-lg focus:ring-2 focus:ring-[#4E6688] focus:border-transparent outline-none transition-all duration-200 bg-white"
                required
              >
                <option value="">{t("select_preferred_language")}</option>
                {Object.entries(groupedLanguages).map(([country, languages]) => (
                  <optgroup key={country} label={country}>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#4E6688] text-[#E3EEB2] py-2 px-4 rounded-lg hover:bg-[#332D56] transition-colors duration-200 font-semibold shadow-md"
          >
            {t("save_and_continue")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;



