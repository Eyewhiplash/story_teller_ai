import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { saveStory, getStoryById } from '../services/api'
import AuthModal from './AuthModal'

const translations = {
  en: {
    title: 'Your Story',
    createNew: 'Create New Story',
    saveStory: 'Save Story',
    storySaved: 'Story saved successfully!',
    backToHome: 'Back to Home',
    loading: 'Loading your story...',
    errorLoading: 'Could not load story. Please try creating a new one.',
    errorSaving: 'Error saving story. Please try again.',
    loginRequired: 'You need to log in to save stories.',
    publicStory: "This is a public story. Log in to save your own stories.",
    loginToSave: "Login to Save"
  },
  sv: {
    title: 'Din berättelse',
    createNew: 'Skapa ny berättelse',
    saveStory: 'Spara berättelse',
    storySaved: 'Berättelsen har sparats!',
    backToHome: 'Tillbaka till startsidan',
    loading: 'Laddar din berättelse...',
    errorLoading: 'Kunde inte ladda berättelsen. Försök skapa en ny.',
    errorSaving: 'Kunde inte spara berättelsen. Försök igen.',
    loginRequired: 'Du måste logga in för att spara berättelser.',
    publicStory: "Detta är en offentlig berättelse. Logga in för att spara dina egna berättelser.",
    loginToSave: "Logga in för att spara"
  }
}

export default function StoryDisplay() {
  const { language } = useLanguage()
  const t = translations[language]
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  useEffect(() => {
    const loadStory = async () => {
      setLoading(true)
      
      try {
        // Check if there's a storyId parameter in URL
        const params = new URLSearchParams(location.search)
        const storyId = params.get('storyId')
        
        // If storyId is in URL, get story from API
        if (storyId) {
          const fetchedStory = await getStoryById(parseInt(storyId))
          setStory(fetchedStory)
        } else {
          // Otherwise, try to load from localStorage
          const storedStory = localStorage.getItem('generatedStory')
          
          if (storedStory) {
            try {
              setStory(JSON.parse(storedStory))
            } catch (err) {
              console.error('Failed to parse stored story:', err)
              setError(t.errorLoading)
            }
          } else {
            setError(t.errorLoading)
          }
        }
      } catch (err) {
        console.error('Failed to load story:', err)
        setError(t.errorLoading)
      } finally {
        setLoading(false)
      }
    }
    
    loadStory()
  }, [location.search, t.errorLoading])
  
  const handleSaveStory = async () => {
    if (!story) return
    
    // Check if user is logged in
    if (!user) {
      // Show auth modal instead of error
      setShowAuthModal(true)
      return
    }
    
    try {
      setSaving(true)
      await saveStory(story.id)
      setSaved(true)
    } catch (err) {
      console.error('Failed to save story:', err)
      setError(t.errorSaving)
    } finally {
      setSaving(false)
    }
  }
  
  const handleCreateNew = () => {
    navigate('/create-story')
  }
  
  const handleBackToHome = () => {
    navigate('/')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">{t.loading}</p>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-6">{error}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors duration-200"
            >
              {t.createNew}
            </button>
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-opacity-90 transition-colors duration-200"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">{t.errorLoading}</p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors duration-200"
          >
            {t.createNew}
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-center mb-2">{story?.title}</h1>
            
            {!user && (
              <div className="mb-4 p-3 bg-blue-100/50 text-blue-800 rounded-lg text-center text-sm">
                {t.publicStory}
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {story?.character_type && (
                <span className="px-3 py-1 bg-blue-100/50 text-blue-800 rounded-full text-sm">
                  {story.character_type}
                </span>
              )}
              {story?.setting_type && (
                <span className="px-3 py-1 bg-green-100/50 text-green-800 rounded-full text-sm">
                  {story.setting_type}
                </span>
              )}
              {story?.theme_type && (
                <span className="px-3 py-1 bg-purple-100/50 text-purple-800 rounded-full text-sm">
                  {story.theme_type}
                </span>
              )}
              {story?.age_group && (
                <span className="px-3 py-1 bg-yellow-100/50 text-yellow-800 rounded-full text-sm">
                  {story.age_group}
                </span>
              )}
            </div>
          </div>
          
          <div className="story-content prose max-w-none mb-8 whitespace-pre-line">
            {story?.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors duration-200"
            >
              {t.createNew}
            </button>
            
            {!saved ? (
              user ? (
                <button
                  onClick={handleSaveStory}
                  disabled={saving}
                  className={`px-6 py-3 rounded-xl ${
                    saving 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-green-500 text-white hover:bg-opacity-90 transition-colors duration-200'
                  }`}
                >
                  {saving ? '...' : t.saveStory}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors duration-200"
                >
                  {t.loginToSave}
                </button>
              )
            ) : (
              <span className="px-6 py-3 bg-green-100 text-green-800 rounded-xl">
                {t.storySaved}
              </span>
            )}
            
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-opacity-90 transition-colors duration-200"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

// The error message indicates that Vite cannot find the `styles.css` file that's being imported in `main.jsx`. This is a common issue when the CSS file hasn't been created yet or is in a different location than expected.

// To fix this, you need to either:

// 1. Create the missing CSS file at `src/styles.css`, or
// 2. Remove/comment out the import if you're not using it yet

// Here's how to fix it:

// 1. First, create a new file at `src/styles.css`