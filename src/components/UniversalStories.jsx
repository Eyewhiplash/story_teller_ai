import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { generateStory } from '../services/api';

// Import story images commented out to fix build errors
// import redRidingHoodImg from '../assets/images/stories/red-riding-hood.png';
// import tortoiseImg from '../assets/images/stories/tortoise-hare.png';
// import cinderellaImg from '../assets/images/stories/cinderella.png';
// import threeLittlePigsImg from '../assets/images/stories/three-little-pigs.png';
// import jackBeanstalkImg from '../assets/images/stories/jack-beanstalk.png';
// import goldenGooseImg from '../assets/images/stories/golden-goose.png';

// Fallback image if custom image is missing
// import defaultStoryImg from '../assets/images/stories/default-story.png';

const translations = {
  en: {
    title: 'Universal Stories',
    subtitle: 'Timeless tales from around the world',
    selectStory: 'Select a story to generate',
    generating: 'Generating your story...',
    redRidingHood: {
      title: 'Little Red Riding Hood',
      origin: 'Classic European Tale',
      description: 'A young girl\'s journey through the woods and her encounter with the wolf.'
    },
    tortoise: {
      title: 'The Tortoise and the Hare',
      origin: 'Aesop\'s Fables',
      description: 'A race between unlikely competitors teaches an important lesson about perseverance.'
    },
    cinderella: {
      title: 'Cinderella',
      origin: 'Classic Fairy Tale',
      description: 'A magical story of transformation and finding true love despite difficult circumstances.'
    },
    threeLittlePigs: {
      title: 'The Three Little Pigs',
      origin: 'English Fairy Tale',
      description: 'Three pig brothers each build a house, but only one withstands the wolf\'s huffing and puffing.'
    },
    jackBeanstalk: {
      title: 'Jack and the Beanstalk',
      origin: 'English Fairy Tale',
      description: 'A boy trades his cow for magic beans, leading to an adventure with a giant in the clouds.'
    },
    goldenGoose: {
      title: 'The Golden Goose',
      origin: 'Brothers Grimm',
      description: 'A kind-hearted young man is rewarded with a goose with golden feathers, creating a sticky situation.'
    }
  },
  sv: {
    title: 'Universella Sagor',
    subtitle: 'Tidlösa berättelser från hela världen',
    selectStory: 'Välj en saga att generera',
    generating: 'Skapar din berättelse...',
    redRidingHood: {
      title: 'Rödluvan',
      origin: 'Klassisk Europeisk Saga',
      description: 'En ung flickas resa genom skogen och hennes möte med vargen.'
    },
    tortoise: {
      title: 'Sköldpaddan och Haren',
      origin: 'Aisopos Fabler',
      description: 'Ett lopp mellan osannolika tävlande lär en viktig läxa om uthållighet.'
    },
    cinderella: {
      title: 'Askungen',
      origin: 'Klassisk Saga',
      description: 'En magisk berättelse om förvandling och att hitta sann kärlek trots svåra omständigheter.'
    },
    threeLittlePigs: {
      title: 'De Tre Små Grisarna',
      origin: 'Engelsk Saga',
      description: 'Tre grisebröder bygger var sitt hus, men bara ett står emot vargens pustande och blåsande.'
    },
    jackBeanstalk: {
      title: 'Jack och Bönstjälken',
      origin: 'Engelsk Saga',
      description: 'En pojke byter sin ko mot magiska bönor, vilket leder till ett äventyr med en jätte i molnen.'
    },
    goldenGoose: {
      title: 'Den Gyllene Gåsen',
      origin: 'Bröderna Grimm',
      description: 'En godhjärtad ung man belönas med en gås med gyllene fjädrar, vilket skapar en klibbig situation.'
    }
  }
};

const universalStories = [
  'redRidingHood',
  'tortoise',
  'cinderella',
  'threeLittlePigs',
  'jackBeanstalk',
  'goldenGoose'
];

// Story image mapping
const storyImages = {
  // We'll load these dynamically
};

// Keep emoji icons as fallbacks
const storyIcons = {
  redRidingHood: '🧢',
  tortoise: '🐢',
  cinderella: '👠',
  threeLittlePigs: '🏠',
  jackBeanstalk: '🌱',
  goldenGoose: '🦢'
};

export default function UniversalStories() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];
  
  const [generating, setGenerating] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyImages, setStoryImages] = useState({});
  
  // Load images dynamically instead of using static imports
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = {};
      
      const imagePaths = {
        redRidingHood: 'red-riding-hood.png',
        tortoise: 'tortoise-hare.png',
        cinderella: 'cinderella.png',
        threeLittlePigs: 'three-little-pigs.png',
        jackBeanstalk: 'jack-beanstalk.png',
        goldenGoose: 'golden-goose.png'
      };
      
      for (const storyKey of universalStories) {
        try {
          // Use a dynamic approach that won't error at build time
          const imgUrl = new URL(`../assets/images/stories/${imagePaths[storyKey]}`, import.meta.url);
          imageMap[storyKey] = imgUrl.href;
        } catch (e) {
          console.warn(`Could not load image for ${storyKey}:`, e);
          imageMap[storyKey] = null;
        }
      }
      
      setStoryImages(imageMap);
    };
    
    loadImages();
  }, []);
  
  const handleGenerateStory = async (storyKey) => {
    setSelectedStory(storyKey);
    setGenerating(true);
    
    try {
      // Prepare story parameters
      const storyInfo = t[storyKey];
      
      const storyParams = {
        character_type: storyInfo.title,
        setting_type: storyInfo.origin,
        theme_type: "Classic Tale",
        age_group: "6-8",
        language: language,
        story_length: "medium",
        custom_prompt: `Retell the classic story of ${storyInfo.title} in a child-friendly way.`
      };
      
      // Generate story with API - pass false to not require authentication
      const generatedStory = await generateStory(storyParams, false);
      
      // Store the generated story in localStorage
      localStorage.setItem('generatedStory', JSON.stringify(generatedStory));
      
      // Navigate to story display
      navigate('/story-display');
    } catch (error) {
      console.error('Failed to generate story:', error);
      alert(error.message);
    } finally {
      setGenerating(false);
      setSelectedStory(null);
    }
  };
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
          {!generating && (
            <p className="text-gray-600 mt-2">{t.selectStory}</p>
          )}
          {generating && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-lg text-gray-600 mb-2">{t.generating}</p>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {universalStories.map((storyKey) => (
            <div 
              key={storyKey}
              className={`bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 cursor-pointer transition-all ${
                generating && selectedStory === storyKey ? 'ring-4 ring-primary transform scale-105' : 'hover:shadow-xl hover:scale-105'
              } ${generating && selectedStory !== storyKey ? 'opacity-50' : ''}`}
              onClick={() => !generating && handleGenerateStory(storyKey)}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t[storyKey].title}</h2>
              <p className="text-gray-600 mb-2">{t[storyKey].origin}</p>
              <div className="h-40 bg-gray-100/20 backdrop-blur-sm rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                {storyImages[storyKey] ? (
                  <img 
                    src={storyImages[storyKey]} 
                    alt={t[storyKey].title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      console.warn(`Error loading image for ${storyKey}`);
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<span class="text-4xl">${storyIcons[storyKey]}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-4xl">{storyIcons[storyKey]}</span>
                )}
              </div>
              <p className="text-gray-700 line-clamp-3">{t[storyKey].description}</p>
              
              {generating && selectedStory === storyKey && (
                <div className="mt-2 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 