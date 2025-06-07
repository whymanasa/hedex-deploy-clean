import React, { useState } from 'react';
import ContentQuiz from './ContentQuiz';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function OutputDisplay({ localizedContent, language }) {
    const [showQuiz, setShowQuiz] = useState(false);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const { t } = useTranslation();

    if (!localizedContent) {
        return null;
    }

    const handleDownload = async (format) => {
        setShowDownloadOptions(false);

        if (format === 'pdf') {
            try {
                const contentDiv = document.createElement('div');
                contentDiv.style.width = '210mm';
                contentDiv.style.padding = '20mm';
                contentDiv.style.fontFamily = 'Arial, sans-serif';
                contentDiv.style.fontSize = '12pt';
                contentDiv.style.lineHeight = '1.5';
                contentDiv.style.whiteSpace = 'pre-wrap';
                contentDiv.style.position = 'absolute';
                contentDiv.style.left = '-9999px';
                contentDiv.style.top = '-9999px';
                
                contentDiv.innerHTML = localizedContent;
                
                document.body.appendChild(contentDiv);
                
                const canvas = await html2canvas(contentDiv, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });
                
                document.body.removeChild(contentDiv);
                
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('localized-content.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
            }
        } else if (format === 'txt') {
            const blob = new Blob([localizedContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'localized-content.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (format === 'docx') {
            try {
                const response = await axios.post(
                    'http://localhost:3000/download-docx',
                    { content: localizedContent },
                    { responseType: 'blob' }
                );

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'localized-content.docx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error('Error generating DOCX:', error.response?.data || error.message);
                alert('Error generating DOCX. Please try again.');
            }
        }
    };

    return (
        <div className="flex-1 border border-[#71C0BB] rounded-lg overflow-y-auto relative bg-[#E3EEB2]">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#332D56]">{t('localized_content')}</h2>
                    <div className="relative flex space-x-2">
                        <button
                            onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                            className="bg-[#4E6688] text-[#E3EEB2] px-4 py-2 rounded-lg hover:bg-[#332D56] transition-colors flex items-center space-x-2"
                        >
                            <span>📥</span>
                            <span>{t('download_format')}</span>
                        </button>
                        {showDownloadOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#71C0BB] rounded-md shadow-lg z-10 top-full">
                                <button
                                    onClick={() => handleDownload('pdf')}
                                    className="block w-full text-left px-4 py-2 text-[#332D56] hover:bg-[#71C0BB] hover:text-[#E3EEB2]"
                                >
                                    {t('pdf')}
                                </button>
                                <button
                                    onClick={() => handleDownload('docx')}
                                    className="block w-full text-left px-4 py-2 text-[#332D56] hover:bg-[#71C0BB] hover:text-[#E3EEB2]"
                                >
                                    {t('docx')}
                                </button>
                                <button
                                    onClick={() => handleDownload('txt')}
                                    className="block w-full text-left px-4 py-2 text-[#332D56] hover:bg-[#71C0BB] hover:text-[#E3EEB2]"
                                >
                                    {t('txt')}
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => setShowQuiz(!showQuiz)}
                            className="bg-[#4E6688] text-[#E3EEB2] px-4 py-2 rounded-lg hover:bg-[#332D56] transition-colors shadow-lg flex items-center space-x-2"
                        >
                            <span>{showQuiz ? '✕' : '📝'}</span>
                            <span>{showQuiz ? t('close_quiz') : t('take_quiz')}</span>
                        </button>
                    </div>
                </div>
                <div className="prose prose-gray max-w-none text-[#4E6688]">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6 text-[#332D56]" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-4 text-[#332D56]" {...props} />,
                            p: ({node, ...props}) => <p className="mb-4 text-[#4E6688]" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-8 mb-4" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-8 mb-4" {...props} />,
                            li: ({node, ...props}) => <li className="mb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-[#332D56] font-semibold" {...props} />,
                        }}
                    >
                        {localizedContent}
                    </ReactMarkdown>
                </div>
            </div>

            {showQuiz && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <ContentQuiz
                            content={localizedContent}
                            language={language}
                            onClose={() => setShowQuiz(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default OutputDisplay;


