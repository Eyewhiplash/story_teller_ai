import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { useUser } from '../contexts/UserContext'
import AuthModal from './AuthModal'
import { Settings, X, User, LogOut } from 'lucide-react'

const themes = {
  candy: {
    name: 'Candy Land',
    description: 'A sweet and colorful world',
    icon: '🍬',
    background: 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200'
  },
  tropical: {
    name: 'Tropical Paradise',
    description: 'Sunny beaches and palm trees',
    icon: '🌴',
    background: 'bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400'
  },
  space: {
    name: 'Space Adventure',
    description: 'Explore the cosmos',
    icon: '🚀',
    background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black'
  },
  sunset: {
    name: 'Sunset Dreams',
    description: 'Warm and peaceful evenings',
    icon: '🌅',
    background: 'bg-gradient-to-br from-orange-400 via-red-500 to-purple-600'
  },
  rainbow: {
    name: 'Rainbow Magic',
    description: 'Colorful and magical world',
    icon: '🌈',
    background: 'bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400'
  },
  ocean: {
    name: 'Ocean Depths',
    description: 'Underwater adventures',
    icon: '🐠',
    background: 'bg-gradient-to-br from-blue-600 via-blue-400 to-teal-400'
  },
  jungle: {
    name: 'Jungle Safari',
    description: 'Wild and adventurous',
    icon: '🌿',
    background: 'bg-gradient-to-br from-green-600 via-green-400 to-yellow-400'
  },
  magic: {
    name: 'Magic Kingdom',
    description: 'Enchanted fairy tale world',
    icon: '✨',
    background: 'bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400'
  }
}

export default function Header({ selectedTheme, setSelectedTheme }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { t } = useTranslation()
  const userContext = useUser()
  const { user, logout } = userContext
  console.log('User context in Header:', userContext)
  const navigate = useNavigate()

  return (
    <header>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm">
        <div className="container px-4 py-1 mx-auto">
          <div className="flex justify-between items-center h-10">
            {/* Left side - Theme Settings */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1 text-sm font-medium text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
              >
                {t('theme')}
              </button>
            </div>

            {/* Middle - Empty */}
            <div className="flex-1"></div>

            {/* Right side - Home and Login/User Menu */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="p-1 rounded-full transition-colors duration-200 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/settings"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-800"
                    title={t('settings')}
                  >
                    <Settings className="w-5 h-5" />
                  </Link>

                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); 
                      console.log('Direct Logout button clicked - attempting logout');
                      try {
                        localStorage.removeItem('storyteller_user');
                        console.log('Removed storyteller_user from localStorage');
                        window.location.reload();
                      } catch (err) {
                        console.error("Logout failed:", err);
                        window.location.reload();
                      }
                    }}
                    className="flex items-center px-4 py-1.5 transparent text-gray-700 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 shadow-sm text-sm font-medium"
                    title={t('logout')}
                  >
                    <LogOut className="mr-2 w-4 h-4 text-red-500" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center px-3 py-1 text-sm font-semibold text-white rounded-lg transition-colors duration-200 bg-primary hover:bg-opacity-90 shadow-soft"
                >
                  <span>{t('login')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Theme Settings Panel */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isSettingsOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="overflow-auto p-6 h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Theme Settings</h2>
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Choose a World</h3>
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(themes).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      setSelectedTheme(theme);
                      setIsSettingsOpen(false);
                    }}
                    className={`flex items-center p-4 rounded-xl transition-all ${
                      selectedTheme === theme 
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 shadow-md border-2 border-blue-300' 
                        : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${themes[theme].background} shadow-sm`}>
                      <span className="text-xl">{themes[theme].icon}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-800">{themes[theme].name}</h4>
                      <p className="text-sm text-gray-600">{themes[theme].description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay when settings are open */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-30"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}
      
      {/* User menu overlay */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  )
}