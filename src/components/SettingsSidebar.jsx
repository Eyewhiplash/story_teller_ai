import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../hooks/useTranslation'

export default function SettingsSidebar({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This will be replaced with actual auth state
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const [theme, setTheme] = useState('light') // Default to light theme

  if (!isOpen) return null

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    // Here you would implement the language change logic
    // This could involve updating a context or state that manages the app's language
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    // Here you would implement the theme change logic
    // This could involve updating a context or state that manages the app's theme
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">{t('settings')}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 py-3 text-center ${
                activeTab === 'general'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('general')}
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 py-3 text-center ${
                activeTab === 'appearance'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('appearance')}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">{t('userSettings')}</h3>
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                          U
                        </div>
                        <div>
                          <p className="font-medium">{t('username')}</p>
                          <p className="text-sm text-gray-500">user@example.com</p>
                        </div>
                      </div>
                      <button className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200">
                        {t('logout')}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">{t('loginToAccessSettings')}</p>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200">
                        {t('login')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">{t('language')}</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleLanguageChange('sv')}
                      className={`w-full py-2 px-4 rounded-lg text-left ${
                        language === 'sv'
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {t('swedish')}
                    </button>
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full py-2 px-4 rounded-lg text-left ${
                        language === 'en'
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {t('english')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">{t('theme')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 border-2 rounded-lg ${
                        theme === 'light' ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="h-20 bg-white rounded-lg border border-gray-200"></div>
                      <p className="mt-2 text-center">{t('light')}</p>
                    </button>
                    <button 
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 border-2 rounded-lg ${
                        theme === 'dark' ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="h-20 bg-gray-900 rounded-lg"></div>
                      <p className="mt-2 text-center">{t('dark')}</p>
                    </button>
                    <button 
                      onClick={() => handleThemeChange('blue')}
                      className={`p-4 border-2 rounded-lg ${
                        theme === 'blue' ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg"></div>
                      <p className="mt-2 text-center">{t('blue')}</p>
                    </button>
                    <button 
                      onClick={() => handleThemeChange('purple')}
                      className={`p-4 border-2 rounded-lg ${
                        theme === 'purple' ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg"></div>
                      <p className="mt-2 text-center">{t('purple')}</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">{t('fontSize')}</h3>
                  <div className="flex items-center space-x-4">
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">{t('small')}</button>
                    <button className="px-3 py-1 border rounded-lg bg-primary text-white">{t('medium')}</button>
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">{t('large')}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 