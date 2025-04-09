import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('welcomeToStoryTeller')}</h1>
          <p className="text-lg text-gray-600">{t('createMagicalStories')}</p>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Story Section */}
          <Link to="/story" className="block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('createStory')}</h2>
              <div className="h-32 bg-gray-100/20 rounded-lg"></div>
            </div>
          </Link>

          {/* Drawing Pad Section */}
          <Link to="/drawing-pad" className="block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('drawingPad')}</h2>
              <div className="h-32 bg-gray-100/20 rounded-lg"></div>
            </div>
          </Link>

          {/* Calculator Section */}
          <Link to="/calculator" className="block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('calculator')}</h2>
              <div className="h-32 bg-gray-100/20 rounded-lg"></div>
            </div>
          </Link>

          {/* Draw Letters Section */}
          <Link to="/draw-letters" className="block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('drawLetters')}</h2>
              <div className="h-32 bg-gray-100/20 rounded-lg"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 