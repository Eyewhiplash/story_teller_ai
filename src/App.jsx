import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserProvider } from './contexts/UserContext'
import BackgroundWithSettings from './components/BackgroundWithSettings'
import Home from './components/Home'
import Story from './components/Story'
import Activity from './components/Activity'
import DrawingPad from './components/Games/DrawingPad'
import CharacterSelection from './components/CreateStory/CharacterSelection'
import SettingSelection from './components/CreateStory/SettingSelection'
import AdventureSelection from './components/CreateStory/AdventureSelection'
import StoryDisplay from './components/StoryDisplay'
import SavedStories from './components/SavedStories'
import UniversalStories from './components/UniversalStories'
import ChildsCalculator from './components/Calculator/ChildsCalculator'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import UserSettings from './components/UserSettings'
import { useState } from 'react'

function App() {
  const [selectedTheme, setSelectedTheme] = useState('candy')

  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <BackgroundWithSettings selectedTheme={selectedTheme} />
            <div className="flex relative flex-col flex-1">
              <Header selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
              <main className="container flex-1 px-4 py-8 mx-auto">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/story" element={<Story />} />
                  <Route path="/activity" element={<Activity />} />
                  <Route path="/drawing-pad" element={<DrawingPad />} />
                  <Route path="/calculator" element={<ChildsCalculator />} />
                  
                  {/* Protected Routes */}
                  <Route path="/create-story" element={
                    <ProtectedRoute>
                      <CharacterSelection />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-story/setting" element={
                    <ProtectedRoute>
                      <SettingSelection />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-story/adventure" element={
                    <ProtectedRoute>
                      <AdventureSelection />
                    </ProtectedRoute>
                  } />
                  <Route path="/story-display" element={
                    <ProtectedRoute>
                      <StoryDisplay />
                    </ProtectedRoute>
                  } />
                  <Route path="/saved-stories" element={
                    <ProtectedRoute>
                      <SavedStories />
                    </ProtectedRoute>
                  } />
                  <Route path="/universal-stories" element={
                    <ProtectedRoute>
                      <UniversalStories />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <UserSettings />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App