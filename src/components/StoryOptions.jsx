import { Link } from 'react-router-dom'

export default function StoryOptions() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary mb-4 animate-bounce-slow">
          Welcome to StoryTeller AI
        </h1>
        <p className="text-2xl text-text">
          Create magical stories and have fun drawing!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Story Creation Section */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">Create Your Story</h2>
            <p className="text-text">Choose a character, setting, and adventure to create your magical tale!</p>
          </div>

          <div className="space-y-6">
            <Link
              to="/create-story/character"
              className="block p-6 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105 shadow-soft"
            >
              <div className="flex items-center justify-center space-x-4">
                <span className="text-4xl">👤</span>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Choose Your Character</h3>
                  <p className="text-sm">Select a magical character for your story</p>
                </div>
              </div>
            </Link>

            <Link
              to="/create-story/setting"
              className="block p-6 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105 shadow-soft"
            >
              <div className="flex items-center justify-center space-x-4">
                <span className="text-4xl">🏰</span>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Pick a Setting</h3>
                  <p className="text-sm">Choose where your adventure takes place</p>
                </div>
              </div>
            </Link>

            <Link
              to="/create-story/adventure"
              className="block p-6 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-200 transform hover:scale-105 shadow-soft"
            >
              <div className="flex items-center justify-center space-x-4">
                <span className="text-4xl">✨</span>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Start Your Adventure</h3>
                  <p className="text-sm">Begin your magical journey!</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Drawing Pad Card */}
        <Link
          to="/games"
          className="bg-white rounded-2xl shadow-soft p-8 transform hover:scale-105 transition-all duration-200"
        >
          <div className="text-center">
            <span className="text-6xl mb-4 block">🎨</span>
            <h2 className="text-3xl font-bold text-primary mb-4">Drawing Pad</h2>
            <p className="text-text mb-6">Draw your magical world with our fun drawing tools!</p>
            <div className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors duration-200 shadow-soft">
              Start Drawing
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
} 