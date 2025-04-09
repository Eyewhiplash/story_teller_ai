import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const translations = {
  en: {
    title: "Story Section",
    subtitle: "Choose your story adventure!",
    createNew: "Create New Story",
    saved: "Saved Stories",
    universal: "Universal Stories"
  },
  sv: {
    title: "Berättelser",
    subtitle: "Välj ditt berättelseäventyr!",
    createNew: "Skapa ny berättelse",
    saved: "Sparade berättelser",
    universal: "Universella berättelser"
  }
};

export default function Story() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Create New Story */}
          <Link to="/create-story" className="block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t.createNew}</h2>
              <div className="h-32 bg-gray-100/20 rounded-lg"></div>
            </div>
          </Link>

          {/* Saved Stories */}
          <Link to="/saved-stories" className="block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t.saved}</h2>
              <div className="h-32 bg-gray-100/20 rounded-lg"></div>
            </div>
          </Link>

          {/* Universal Stories */}
          <Link to="/universal-stories" className="block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t.universal}</h2>
              <div className="h-32 bg-gray-100/20 rounded-lg"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 