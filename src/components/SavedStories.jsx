import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { getStories } from '../services/api'

const translations = {
  en: {
    title: "Saved Stories",
    noStories: "No saved stories yet.",
    readMore: "Read More",
    delete: "Delete",
    error: "Error loading stories"
  },
  sv: {
    title: "Sparade berättelser",
    noStories: "Inga sparade berättelser än.",
    readMore: "Läs mer",
    delete: "Ta bort",
    error: "Fel vid laddning av berättelser"
  }
}

export default function SavedStories() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { language } = useLanguage()
  const { user } = useUser()
  const t = translations[language]

  useEffect(() => {
    const fetchSavedStories = async () => {
      if (!user || !user.id) {
        setLoading(false)
        return
      }
      
      try {
        // Get stories created by the current user
        const userStories = await getStories(user.id);
        setStories(userStories || []);
      } catch (error) {
        console.error('Error fetching saved stories:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStories();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-lg text-red-600 mb-4">{t.error}: {error}</p>
          <button
            onClick={() => navigate('/create-story')}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors duration-200"
          >
            Create New Story
          </button>
        </div>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{t.noStories}</p>
          <p className="text-gray-600 mb-4">Create your first story to see it here!</p>
          <button
            onClick={() => navigate('/create-story')}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors duration-200"
          >
            Create New Story
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">Your collection of magical tales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 cursor-pointer"
              onClick={() => navigate(`/story-display?storyId=${story.id}`)}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">{story.title || 'Untitled Story'}</h2>
              <p className="text-gray-600 mb-2">
                Created: {new Date(story.created_at).toLocaleDateString()}
              </p>
              <div className="h-32 bg-gray-100/20 backdrop-blur-sm rounded-lg mb-2 overflow-hidden">
                <div className="p-2 text-xs text-gray-700 overflow-hidden line-clamp-5">
                  {story.content.substring(0, 200)}...
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <button 
                  className="text-primary hover:text-opacity-80 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/story-display?storyId=${story.id}`);
                  }}
                >
                  {t.readMore}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 