import { useState } from 'react'
import DrawingPad from './DrawingPad'

export default function Games() {
  const [activeGame, setActiveGame] = useState('drawing')

  const games = [
    {
      id: 'drawing',
      name: 'Drawing Pad',
      icon: '🎨',
      description: 'Draw your magical world!'
    },
    {
      id: 'letters',
      name: 'Draw Letters',
      icon: '✏️',
      description: 'Learn to write letters'
    },
    {
      id: 'calculator',
      name: 'Kids Calculator',
      icon: '🔢',
      description: 'Fun with numbers'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4 animate-bounce-slow">
          Fun Learning Games
        </h1>
        <p className="text-2xl text-text">
          Play and learn with our magical games!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`p-6 rounded-2xl shadow-soft transition-all duration-200 transform hover:scale-105 ${
              activeGame === game.id
                ? 'bg-primary text-white'
                : 'bg-white text-text hover:bg-gray-50'
            }`}
          >
            <div className="text-4xl mb-4">{game.icon}</div>
            <h2 className="text-xl font-bold mb-2">{game.name}</h2>
            <p className="text-sm">{game.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeGame === 'drawing' && <DrawingPad />}
        {activeGame === 'letters' && (
          <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Draw Letters</h2>
            <p className="text-text">Coming soon! Learn to write letters in a fun way.</p>
          </div>
        )}
        {activeGame === 'calculator' && (
          <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Kids Calculator</h2>
            <p className="text-text">Coming soon! Have fun with numbers!</p>
          </div>
        )}
      </div>
    </div>
  )
} 