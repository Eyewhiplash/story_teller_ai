import { useState, useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'

export default function SavedStories() {
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    // This will be replaced with actual API call when backend is ready
    const loadStories = () => {
      try {
        const savedStories = JSON.parse(localStorage.getItem('savedStories')) || []
        setStories(savedStories)
      } catch (error) {
        console.error('Error loading stories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStories()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('savedStories')}</h1>
          
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">{t('noStories')}</p>
              <p className="text-gray-500">{t('createFirstStory')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {stories.map((story, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{story.title || t('untitledStory')}</h2>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-primary">
                        {t('edit')}
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-700">
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">{story.content}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(story.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 