import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { getStoryPrompts } from '../../services/api'

// Comment out static import to prevent build errors when file doesn't exist
// import defaultSettingImg from '../../assets/images/elements/default-setting.png';

const translations = {
  en: {
    title: 'Select a Setting',
    subtitle: 'Where will your story take place?',
    next: 'Next',
    back: 'Back',
    loading: 'Loading setting options...',
    error: 'Error loading settings. Please try again.'
  },
  sv: {
    title: 'Välj en miljö',
    subtitle: 'Var ska din berättelse utspela sig?',
    next: 'Nästa',
    back: 'Tillbaka',
    loading: 'Laddar miljöalternativ...',
    error: 'Fel vid laddning av miljöer. Försök igen.'
  }
}

// Helper function to format setting name for image filename
const formatImageFilename = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export default function SettingSelection() {
  const { language } = useLanguage()
  const t = translations[language]
  const navigate = useNavigate()
  
  const [settings, setSettings] = useState([])
  const [selectedSetting, setSelectedSetting] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [settingImages, setSettingImages] = useState({})

  // Add state for default image
  const [defaultImage, setDefaultImage] = useState(null);

  useEffect(() => {
    // Try to load default image
    try {
      const defaultImgUrl = new URL('../../assets/images/elements/default-setting.png', import.meta.url);
      setDefaultImage(defaultImgUrl.href);
    } catch (e) {
      console.warn('Could not load default setting image:', e);
    }

    // Retrieve the selected character from localStorage
    const storedCharacter = localStorage.getItem('selectedCharacter')
    if (!storedCharacter) {
      navigate('/create-story')
      return
    }
    setSelectedCharacter(storedCharacter)

    const fetchSettings = async () => {
      try {
        setLoading(true)
        const prompts = await getStoryPrompts(language)
        
        // Extract unique setting types
        const uniqueSettings = [...new Set(prompts.map(prompt => prompt.setting_type))]
        setSettings(uniqueSettings)
        
        // Dynamically load setting images
        const images = {};
        for (const setting of uniqueSettings) {
          const formattedName = formatImageFilename(setting);
          try {
            // Try to import dynamically with a more reliable error handling approach
            import(`../../assets/images/elements/settings/${formattedName}.png`)
              .then(imageModule => {
                images[setting] = imageModule.default;
              })
              .catch(err => {
                console.warn(`No custom image found for setting: ${setting}`);
                images[setting] = null;
              });
          } catch (err) {
            console.warn(`Error loading image for setting: ${setting}`);
            images[setting] = null;
          }
        }
        setSettingImages(images);
        setError(null)
      } catch (err) {
        console.error('Failed to fetch settings:', err)
        setError(t.error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [language, navigate, t.error])

  const handleNext = () => {
    if (selectedSetting) {
      localStorage.setItem('selectedSetting', selectedSetting)
      navigate('/create-story/adventure')
    }
  }

  const handleBack = () => {
    navigate('/create-story')
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">{t.loading}</p>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {settings.map((setting, index) => (
              <div
                key={index}
                className={`setting-option p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-md cursor-pointer transition-all ${
                  selectedSetting === setting ? 'ring-4 ring-blue-500 transform scale-105' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedSetting(setting)}
              >
                <div className="h-40 bg-gray-100/30 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                  {settingImages[setting] ? (
                    <img 
                      src={settingImages[setting]} 
                      alt={setting}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.warn(`Error loading image for setting: ${setting}`);
                        if (defaultImage) {
                          e.target.src = defaultImage;
                        } else {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<span class="text-4xl">${setting[0]}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-4xl">{setting[0]}</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-center">{setting}</h3>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-full font-semibold bg-gray-400 text-white hover:bg-gray-500"
          >
            {t.back}
          </button>
          
          <button
            onClick={handleNext}
            disabled={!selectedSetting}
            className={`px-6 py-3 rounded-full font-semibold ${
              selectedSetting
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {t.next}
          </button>
        </div>
      </div>
    </div>
  )
} 