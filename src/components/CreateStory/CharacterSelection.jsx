import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { getStoryPrompts } from '../../services/api'

// Comment out static import to prevent build errors when file doesn't exist
// import defaultCharacterImg from '../../assets/images/elements/default-character.png';

const translations = {
  en: {
    title: 'Select a Character',
    subtitle: 'Choose a character for your story',
    next: 'Next',
    loading: 'Loading character options...',
    error: 'Error loading characters. Please try again.'
  },
  sv: {
    title: 'Välj en karaktär',
    subtitle: 'Välj en karaktär till din berättelse',
    next: 'Nästa',
    loading: 'Laddar karaktärsalternativ...',
    error: 'Fel vid laddning av karaktärer. Försök igen.'
  }
}

// Helper function to format character name for image filename
const formatImageFilename = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export default function CharacterSelection() {
  const { language } = useLanguage()
  const t = translations[language]
  const navigate = useNavigate()
  
  const [characters, setCharacters] = useState([])
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [characterImages, setCharacterImages] = useState({})

  // Add state for default image
  const [defaultImage, setDefaultImage] = useState(null);

  useEffect(() => {
    // Try to load default image
    try {
      const defaultImgUrl = new URL('../../assets/images/elements/default-character.png', import.meta.url);
      setDefaultImage(defaultImgUrl.href);
    } catch (e) {
      console.warn('Could not load default character image:', e);
    }

    const fetchCharacters = async () => {
      try {
        setLoading(true)
        const prompts = await getStoryPrompts(language)
        
        // Extract unique character types
        const uniqueCharacters = [...new Set(prompts.map(prompt => prompt.character_type))]
        setCharacters(uniqueCharacters)
        
        // Dynamically load character images
        const images = {};
        for (const character of uniqueCharacters) {
          const formattedName = formatImageFilename(character);
          try {
            // Try to import dynamically with a more reliable error handling approach
            import(`../../assets/images/elements/characters/${formattedName}.png`)
              .then(imageModule => {
                images[character] = imageModule.default;
              })
              .catch(err => {
                console.warn(`No custom image found for character: ${character}`);
                images[character] = null;
              });
          } catch (err) {
            console.warn(`Error loading image for character: ${character}`);
            images[character] = null;
          }
        }
        setCharacterImages(images);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch characters:', err)
        setError(t.error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCharacters()
  }, [language, t.error])

  const handleNext = () => {
    if (selectedCharacter) {
      localStorage.setItem('selectedCharacter', selectedCharacter)
      navigate('/create-story/setting')
    }
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
            {characters.map((character, index) => (
              <div
                key={index}
                className={`character-option p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-md cursor-pointer transition-all ${
                  selectedCharacter === character ? 'ring-4 ring-blue-500 transform scale-105' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedCharacter(character)}
              >
                <div className="h-40 bg-gray-100/30 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                  {characterImages[character] ? (
                    <img 
                      src={characterImages[character]} 
                      alt={character}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.warn(`Error loading image for character: ${character}`);
                        if (defaultImage) {
                          e.target.src = defaultImage;
                        } else {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<span class="text-4xl">${character[0]}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-4xl">{character[0]}</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-center">{character}</h3>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={handleNext}
            disabled={!selectedCharacter}
            className={`px-6 py-3 rounded-full font-semibold ${
              selectedCharacter
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