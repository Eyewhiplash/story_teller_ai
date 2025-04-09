import { useState } from 'react'
import CharacterSelector from '../components/CharacterSelector'
import SettingSelector from '../components/SettingSelector'
import ThemeSelector from '../components/ThemeSelector'
import StoryDisplay from '../components/StoryDisplay'

export default function StoryCreatorPage() {
  const [storyParams, setStoryParams] = useState({
    characters: [],
    setting: "",
    theme: "",
    ageGroup: "children", // Default to children's stories
    storyLength: "medium", // Default to medium length
  })
  
  const [generatedStory, setGeneratedStory] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  // Handle changes to story parameters
  const handleCharacterChange = (characters) => {
    setStoryParams({ ...storyParams, characters })
  }

  const handleSettingChange = (setting) => {
    setStoryParams({ ...storyParams, setting })
  }

  const handleThemeChange = (theme) => {
    setStoryParams({ ...storyParams, theme })
  }

  const handleAgeGroupChange = (e) => {
    setStoryParams({ ...storyParams, ageGroup: e.target.value })
  }

  const handleStoryLengthChange = (e) => {
    setStoryParams({ ...storyParams, storyLength: e.target.value })
  }

  // Generate the story using the AI backend
  const generateStory = async () => {
    // Validate that we have the minimum required parameters
    if (storyParams.characters.length === 0) {
      setError("Please select at least one character for your story")
      return
    }
    
    if (!storyParams.setting) {
      setError("Please select a setting for your story")
      return
    }
    
    if (!storyParams.theme) {
      setError("Please select a theme for your story")
      return
    }
    
    setError("")
    setIsGenerating(true)
    
    try {
      // In a real implementation, you would send the storyParams to your AI backend
      // const response = await fetch('your-ai-endpoint', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(storyParams),
      // });
      // const data = await response.json();
      // setGeneratedStory(data.story);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock response for development
      const mockStory = {
        title: `The ${storyParams.theme} Adventure`,
        content: `Once upon a time in ${storyParams.setting}, ${storyParams.characters.join(" and ")} embarked on an amazing journey. They discovered the power of ${storyParams.theme} and learned valuable lessons along the way.`,
        moral: "Always be kind and brave in your adventures!",
        imagePrompt: `A children's book illustration of ${storyParams.characters.join(" and ")} in ${storyParams.setting}`
      }
      
      setGeneratedStory(mockStory)
    } catch (err) {
      console.error("Error generating story:", err)
      setError("There was an error generating your story. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Reset the story and parameters
  const resetStory = () => {
    setGeneratedStory(null)
    setStoryParams({
      characters: [],
      setting: "",
      theme: "",
      ageGroup: "children",
      storyLength: "medium",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">Magical Story Creator</h1>
        
        {!generatedStory ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Create Your Story</h2>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-8">
              {/* Character Selection */}
              <div>
                <h3 className="text-lg font-medium mb-3">Who is in your story?</h3>
                <CharacterSelector 
                  selectedCharacters={storyParams.characters}
                  onChange={handleCharacterChange}
                />
              </div>
              
              {/* Setting Selection */}
              <div>
                <h3 className="text-lg font-medium mb-3">Where does your story take place?</h3>
                <SettingSelector 
                  selectedSetting={storyParams.setting}
                  onChange={handleSettingChange}
                />
              </div>
              
              {/* Theme Selection */}
              <div>
                <h3 className="text-lg font-medium mb-3">What is your story about?</h3>
                <ThemeSelector
                  selectedTheme={storyParams.theme}
                  onChange={handleThemeChange}
                />
              </div>
              
              {/* Age Group Selection */}
              <div>
                <h3 className="text-lg font-medium mb-3">Who is your story for?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="ageGroup"
                      value="toddler"
                      checked={storyParams.ageGroup === "toddler"}
                      onChange={handleAgeGroupChange}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span>Toddlers (2-4)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="ageGroup"
                      value="children"
                      checked={storyParams.ageGroup === "children"}
                      onChange={handleAgeGroupChange}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span>Children (5-8)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="ageGroup"
                      value="preteen"
                      checked={storyParams.ageGroup === "preteen"}
                      onChange={handleAgeGroupChange}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span>Preteens (9-12)</span>
                  </label>
                </div>
              </div>
              
              {/* Story Length Selection */}
              <div>
                <h3 className="text-lg font-medium mb-3">How long should your story be?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="storyLength"
                      value="short"
                      checked={storyParams.storyLength === "short"}
                      onChange={handleStoryLengthChange}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span>Short (1-2 min)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="storyLength"
                      value="medium"
                      checked={storyParams.storyLength === "medium"}
                      onChange={handleStoryLengthChange}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span>Medium (3-5 min)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="storyLength"
                      value="long"
                      checked={storyParams.storyLength === "long"}
                      onChange={handleStoryLengthChange}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span>Long (6-10 min)</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={generateStory}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Weaving your magical story...
                    </>
                  ) : (
                    "Create My Story!"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <StoryDisplay 
            story={generatedStory} 
            onCreateNew={resetStory}
          />
        )}
      </div>
    </div>
  )
}