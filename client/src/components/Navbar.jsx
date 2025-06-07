import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSettings } from 'react-icons/fi';

function Navbar() {
    const { t } = useTranslation();

    return (
        <nav className="bg-[#332D56] shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <img src="/logo_built.png" alt="Hex Ed Localiser Logo" className="h-16 w-auto" />
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <Link to="/main" className="text-[#E3EEB2] hover:text-[#71C0BB] px-3 py-2 rounded-md text-sm font-medium">
                            {t('home')}
                        </Link>
                        <Link to="/profile" className="text-[#E3EEB2] hover:text-[#71C0BB] px-3 py-2 rounded-md text-sm font-medium">
                            {t('profile')}
                        </Link>
                        <Link to="/language-selector" className="text-[#E3EEB2] hover:text-[#71C0BB] px-3 py-2 rounded-md text-sm font-medium">
                            <FiSettings size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

