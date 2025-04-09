import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function StorySection() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('storySection')}</h1>
          <p className="text-xl text-gray-600">{t('chooseStoryAdventure')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/create-story" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('createNewStory')}</h2>
              <div className="h-48 bg-gray-100 rounded-xl"></div>
            </div>
          </Link>

          <Link to="/saved-stories" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('savedStories')}</h2>
              <div className="h-48 bg-gray-100 rounded-xl"></div>
            </div>
          </Link>

          <Link to="/universal-stories" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('universalStories')}</h2>
              <div className="h-48 bg-gray-100 rounded-xl"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 