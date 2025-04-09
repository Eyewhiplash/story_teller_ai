import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { getStoryPrompts, generateStory } from '../../services/api'

// Comment out static import to prevent build errors when file doesn't exist
// import defaultThemeImg from '../../assets/images/elements/default-theme.png';

const translations = {
  en: {
    title: 'Select a Theme',
    subtitle: 'What kind of adventure awaits?',
    next: 'Create Story',
    back: 'Back',
    loading: 'Loading theme options...',
    error: 'Error loading themes. Please try again.',
    generatingStory: 'Generating your story...',
    generationError: 'Error generating story. Please try again.'
  },
  sv: {
    title: 'Välj ett tema',
    subtitle: 'Vilken typ av äventyr väntar?',
    next: 'Skapa berättelse',
    back: 'Tillbaka',
    loading: 'Laddar temaval...',
    error: 'Fel vid laddning av teman. Försök igen.',
    generatingStory: 'Skapar din berättelse...',
    generationError: 'Fel vid skapande av berättelse. Försök igen.'
  }
}

// Age group options
const ageGroups = [
  { value: '3-5', labelEn: '3-5 years', labelSv: '3-5 år' },
  { value: '6-8', labelEn: '6-8 years', labelSv: '6-8 år' },
  { value: '9-12', labelEn: '9-12 years', labelSv: '9-12 år' }
]

// Add story length options after the age groups
const storyLengths = [
  { value: 'short', labelEn: 'Short', labelSv: 'Kort' },
  { value: 'medium', labelEn: 'Medium', labelSv: 'Medel' },
  { value: 'long', labelEn: 'Long', labelSv: 'Lång' }
];

// Helper function to format theme name for image filename
const formatImageFilename = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export default function AdventureSelection() {
  const { language } = useLanguage()
  const t = translations[language]
  const navigate = useNavigate()
  
  const [themes, setThemes] = useState([])
  const [selectedTheme, setSelectedTheme] = useState('')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('6-8')
  const [selectedStoryLength, setSelectedStoryLength] = useState('medium')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [selectedSetting, setSelectedSetting] = useState('')
  const [themeImages, setThemeImages] = useState({})

  // Add state for default image
  const [defaultImage, setDefaultImage] = useState(null);

  useEffect(() => {
    // Try to load default image
    try {
      const defaultImgUrl = new URL('../../assets/images/elements/default-theme.png', import.meta.url);
      setDefaultImage(defaultImgUrl.href);
    } catch (e) {
      console.warn('Could not load default theme image:', e);
    }

    // Retrieve the selected character and setting from localStorage
    const storedCharacter = localStorage.getItem('selectedCharacter')
    const storedSetting = localStorage.getItem('selectedSetting')
    
    if (!storedCharacter || !storedSetting) {
      navigate('/create-story')
      return
    }
    
    setSelectedCharacter(storedCharacter)
    setSelectedSetting(storedSetting)

    const fetchThemes = async () => {
      try {
        setLoading(true)
        const prompts = await getStoryPrompts(language)
        
        // Extract unique theme types
        const uniqueThemes = [...new Set(prompts.map(prompt => prompt.theme_type))]
        setThemes(uniqueThemes)
        
        // Dynamically load theme images
        const images = {};
        for (const theme of uniqueThemes) {
          const formattedName = formatImageFilename(theme);
          try {
            // Try to import dynamically with a more reliable error handling approach
            import(`../../assets/images/elements/themes/${formattedName}.png`)
              .then(imageModule => {
                images[theme] = imageModule.default;
              })
              .catch(err => {
                console.warn(`No custom image found for theme: ${theme}`);
                images[theme] = null;
              });
          } catch (err) {
            console.warn(`Error loading image for theme: ${theme}`);
            images[theme] = null;
          }
        }
        setThemeImages(images);
        setError(null)
      } catch (err) {
        console.error('Failed to fetch themes:', err)
        setError(t.error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchThemes()
  }, [language, navigate, t.error])

  const handleCreateStory = async () => {
    if (!selectedTheme || !selectedAgeGroup) return
    
    try {
      setGenerating(true)
      
      // Generate story with selected parameters
      const storyParams = {
        character_type: selectedCharacter,
        setting_type: selectedSetting,
        theme_type: selectedTheme,
        age_group: selectedAgeGroup,
        language: language,
        story_length: selectedStoryLength
      }
      
      const generatedStory = await generateStory(storyParams)
      
      // Store the generated story in localStorage
      localStorage.setItem('generatedStory', JSON.stringify(generatedStory))
      
      // Navigate to story display
      navigate('/story-display')
    } catch (err) {
      console.error('Failed to generate story:', err)
      setError(t.generationError)
    } finally {
      setGenerating(false)
    }
  }

  const handleBack = () => {
    navigate('/create-story/setting')
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
        ) : generating ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">{t.generatingStory}</p>
            <div className="mt-4 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((theme, index) => (
                <div
                  key={index}
                  className={`theme-option p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-md cursor-pointer transition-all ${
                    selectedTheme === theme ? 'ring-4 ring-blue-500 transform scale-105' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  <div className="h-40 bg-gray-100/30 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                    {themeImages[theme] ? (
                      <img 
                        src={themeImages[theme]} 
                        alt={theme}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          console.warn(`Error loading image for theme: ${theme}`);
                          if (defaultImage) {
                            e.target.src = defaultImage;
                          } else {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<span class="text-4xl">${theme[0]}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-4xl">{theme[0]}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-center">{theme}</h3>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <h3 className="font-semibold mb-2">{language === 'en' ? 'Age Group' : 'Åldersgrupp'}</h3>
              <div className="flex flex-wrap gap-3">
                {ageGroups.map((age, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-full ${
                      selectedAgeGroup === age.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    onClick={() => setSelectedAgeGroup(age.value)}
                  >
                    {language === 'en' ? age.labelEn : age.labelSv}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Add Story Length Selection */}
            <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <h3 className="font-semibold mb-2">{language === 'en' ? 'Story Length' : 'Berättelsens längd'}</h3>
              <div className="flex flex-wrap gap-3">
                {storyLengths.map((length, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-full ${
                      selectedStoryLength === length.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    onClick={() => setSelectedStoryLength(length.value)}
                  >
                    {language === 'en' ? length.labelEn : length.labelSv}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-full font-semibold bg-gray-400 text-white hover:bg-gray-500"
            disabled={generating}
          >
            {t.back}
          </button>
          
          <button
            onClick={handleCreateStory}
            disabled={!selectedTheme || generating}
            className={`px-6 py-3 rounded-full font-semibold ${
              selectedTheme && !generating
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