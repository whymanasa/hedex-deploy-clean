import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function InputForm({ setLocalizedContent, preferredLanguage, messages, setMessages }) {
  const { t } = useTranslation();
  const [courseContent, setCourseContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Add message about file upload
      setMessages(prev => [...prev, { 
        type: 'system', 
        content: `File uploaded: ${file.name}`
      }]);

      // For text files, read them directly
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        const content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });
        setCourseContent(content);
      } else {
        // For PDFs and other files, just set the file name
        // The actual processing will be done on the server
        setCourseContent(`File: ${file.name}`);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: `Error reading file: ${error.message}` 
      }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userProfile) {
      alert("Please complete your profile first.");
      return;
    }

    if (!courseContent.trim() && !fileInputRef.current?.files[0]) {
      alert("Please enter some content or upload a file.");
      return;
    }

    setLoading(true);
    if (courseContent.trim() && !fileInputRef.current?.files[0]) {
      setMessages(prev => [...prev, { type: 'user', content: courseContent }]);
    }

    try {
      console.log('User Profile:', userProfile);
      
      // Create form data for file upload
      const formData = new FormData();
      
      // Ensure profile is properly stringified
      const profileToSend = {
        ...userProfile,
        preferredLanguage: userProfile.preferredLanguage || 'en' // Fallback to English if not set
      };
      console.log('Profile being sent:', profileToSend);
      formData.append('profile', JSON.stringify(profileToSend));
      
      if (fileInputRef.current?.files[0]) {
        formData.append('file', fileInputRef.current.files[0]);
      } else {
        formData.append('content', courseContent);
      }
      
      const response = await axios.post('/translate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.localizedContent) {
        setLocalizedContent(response.data.localizedContent);
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          content: response.data.localizedContent
        }]);
      } else {
        throw new Error('No localized content received from server');
      }
    } catch (error) {
      console.error('Translation error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.details 
        ? Object.values(error.response.data.details).filter(Boolean).join(', ')
        : error.response?.data?.error || error.message || 'Something went wrong. Please try again.';
      
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: errorMessage
      }]);
    }

    setLoading(false);
    setCourseContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSummarize = async (e) => {
    e.preventDefault();

    if (!userProfile) {
      alert(t('error.missing_profile'));
      return;
    }

    if (!courseContent.trim() && !fileInputRef.current?.files[0]) {
      alert(t('error.missing_content'));
      return;
    }

    setSummarizing(true);
    setMessages(prev => [...prev, { type: 'user', content: courseContent }]);

    try {
      const formData = new FormData();
      const profileToSend = {
        ...userProfile,
        preferredLanguage: userProfile.preferredLanguage || 'en'
      };
      formData.append('profile', JSON.stringify(profileToSend));

      if (fileInputRef.current?.files[0]) {
        formData.append('file', fileInputRef.current.files[0]);
      } else {
        formData.append('content', courseContent);
      }

      // Use improved request configuration
      const response = await axios({
        method: 'post',
        url: '/summarize',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 30000,
        withCredentials: true,
      });

      if (response.data.summary) {
        setLocalizedContent(response.data.summary);
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: response.data.summary
        }]);
      } else {
        throw new Error('No summary received from server');
      }
    } catch (error) {
      console.error('Summarization error:', error);
      const errorMessage = error.response?.data?.details
        ? Object.values(error.response.data.details).filter(Boolean).join(', ')
        : error.response?.data?.error || error.message || t('error.summarization_failed');

      setMessages(prev => [...prev, {
        type: 'error',
        content: errorMessage
      }]);
    }

    setSummarizing(false);
    setCourseContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadDocx = async (content) => {
    try {
      const response = await axios.post('/download-docx', { content }, {
        responseType: 'blob'
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'localized-content.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      const errorMessage = error.response?.data?.details
        ? Object.values(error.response.data.details).filter(Boolean).join(', ')
        : error.response?.data?.error || error.message || 'Failed to download DOCX. Please try again.';

      setMessages(prev => [...prev, {
        type: 'error',
        content: errorMessage
      }]);
    }
  };

  const handleMessageClick = (message) => {
    if (message.type === 'assistant') {
      setLocalizedContent(message.content);
    }
  };

  const handleGenerateQuiz = async (content, language) => {
    try {
      console.log('Creating questions for:', { content, language });
      
      // Validate input
      if (!content) {
        throw new Error(t('error.missing_content'));
      }

      // Create form data
      const formData = new FormData();
      formData.append('content', content);
      formData.append('language', language || 'en');

      // Add retry logic and better error handling
      const maxRetries = 3;
      let retryCount = 0;
      let lastError = null;

      while (retryCount < maxRetries) {
        try {
          // Use relative URL and add proper configuration
          const response = await axios({
            method: 'post',
            url: '/create-questions', // Updated endpoint
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            timeout: 30000,
            withCredentials: true,
          });

          if (response.data.questions) {
            setMessages(prev => [...prev, {
              type: 'assistant',
              content: JSON.stringify(response.data, null, 2)
            }]);
            return; // Success, exit the function
          } else {
            throw new Error('Invalid question data received');
          }
        } catch (error) {
          lastError = error;
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          
          // Check if it's a client-side blocking error
          if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
            setMessages(prev => [...prev, {
              type: 'error',
              content: t('error.request_blocked', 'Request blocked by browser extension. Please disable ad blocker or try in incognito mode.')
            }]);
            return; // Exit on client blocking
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          retryCount++;
        }
      }

      // If we get here, all retries failed
      throw lastError || new Error('Failed to create questions after multiple attempts');

    } catch (error) {
      console.error('Error creating questions:', error);
      const errorMessage = error.response?.data?.details
        ? Object.values(error.response.data.details).filter(Boolean).join(', ')
        : error.response?.data?.error || error.message || t('error.question_creation_failed');

      setMessages(prev => [...prev, {
        type: 'error',
        content: errorMessage
      }]);
    }
  };

  return (
    <div className="flex flex-col flex-1 border border-[#71C0BB] rounded-lg overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              onClick={() => handleMessageClick(message)}
              className={`max-w-[80%] rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-[#4E6688] text-[#E3EEB2]'
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : message.type === 'system'
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-[#E3EEB2] text-[#4E6688] shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#71C0BB] p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#4E6688] hover:text-[#332D56]"
              title={t('upload_file')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.md,.pdf"
            />
          </div>
          <div className="flex space-x-2">
            <textarea
              className="flex-1 p-3 border border-[#71C0BB] rounded-md resize-none focus:ring-2 focus:ring-[#4E6688] focus:border-transparent outline-none transition-all duration-200"
              rows="3"
              placeholder={t("paste_course_content")}
              value={courseContent}
              onChange={(e) => setCourseContent(e.target.value)}
            />
            <div className="flex flex-col space-y-2">
              <button
                type="submit"
                className="px-6 bg-[#4E6688] text-[#E3EEB2] rounded-md hover:bg-[#332D56] disabled:opacity-50 transition-colors duration-200"
                disabled={loading || summarizing}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  t("translate_button")
                )}
              </button>
              <button
                type="button"
                onClick={handleSummarize}
                className="px-6 bg-[#71C0BB] text-[#332D56] rounded-md hover:bg-[#4E6688] hover:text-[#E3EEB2] disabled:opacity-50 transition-colors duration-200"
                disabled={loading || summarizing}
              >
                {summarizing ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  t("summarize_button")
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputForm;







