import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Star, Moon, Bird, Fish, Rabbit, MountainSnow, Umbrella, Music, Sparkles, Settings, X } from 'lucide-react';

// Custom components for more vibrant visuals
const Sheep = ({ className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="w-14 h-8 bg-white rounded-t-full shadow-inner"></div>
    <div className="-mt-2 w-14 h-8 bg-white rounded-b-full shadow-lg"></div>
    <div className="absolute -right-1 -top-2 w-5 h-7 bg-gray-800 rounded-full"></div>
    <div className="absolute -bottom-3 left-3 w-3 h-5 bg-black rounded-full"></div>
    <div className="absolute right-3 -bottom-3 w-3 h-5 bg-black rounded-full"></div>
    <div className="absolute right-0 top-1 w-2 h-2 bg-white rounded-full"></div>
  </div>
);

const Rainbow = () => (
  <div className="overflow-hidden absolute top-0 left-0 w-full h-64">
    <div className="absolute left-0 top-20 w-full h-64 opacity-60">
      <div className="absolute w-full h-10 bg-red-500 rounded-t-full transform scale-x-150"></div>
      <div className="absolute w-full h-10 bg-orange-400 rounded-t-full transform scale-x-145" style={{ top: '10px' }}></div>
      <div className="absolute w-full h-10 bg-yellow-300 rounded-t-full transform scale-x-140" style={{ top: '20px' }}></div>
      <div className="absolute w-full h-10 bg-green-400 rounded-t-full transform scale-x-135" style={{ top: '30px' }}></div>
      <div className="absolute w-full h-10 bg-blue-400 rounded-t-full transform scale-x-130" style={{ top: '40px' }}></div>
      <div className="absolute w-full h-10 bg-indigo-500 rounded-t-full transform scale-x-125" style={{ top: '50px' }}></div>
      <div className="absolute w-full h-10 bg-purple-500 rounded-t-full transform scale-x-120" style={{ top: '60px' }}></div>
    </div>
  </div>
);

const themes = {
  candy: {
    name: 'Candy World',
    description: 'Sweet treats and bright colors',
    icon: '🍭',
    background: 'bg-gradient-to-b from-pink-400 via-fuchsia-400 to-purple-400'
  },
  tropical: {
    name: 'Tropical Paradise',
    description: 'Sunny beaches and palm trees',
    icon: '🏝️',
    background: 'bg-gradient-to-b from-yellow-300 via-orange-300 to-red-400'
  },
  space: {
    name: 'Space Adventure',
    description: 'Explore the stars and planets',
    icon: '🚀',
    background: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-fuchsia-900'
  },
  sunset: {
    name: 'Sunset Mountains',
    description: 'Peaceful mountain views',
    icon: '🌄',
    background: 'bg-gradient-to-b from-orange-400 via-red-500 to-purple-600'
  },
  rainbow: {
    name: 'Rainbow Land',
    description: 'Colorful and magical',
    icon: '🌈',
    background: 'bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400'
  },
  ocean: {
    name: 'Deep Ocean',
    description: 'Underwater exploration',
    icon: '🌊',
    background: 'bg-gradient-to-b from-cyan-300 via-blue-500 to-indigo-700'
  },
  jungle: {
    name: 'Jungle Safari',
    description: 'Wild plants and animals',
    icon: '🌴',
    background: 'bg-gradient-to-b from-green-400 via-emerald-500 to-teal-600'
  },
  magic: {
    name: 'Magic Kingdom',
    description: 'Sparkly and enchanted world',
    icon: '✨',
    background: 'bg-gradient-to-b from-violet-500 via-purple-500 to-indigo-600'
  }
};

const ThemeElements = ({ theme, phase }) => {
  switch(theme) {
    case 'candy':
      return (
        <>
          <div className="absolute top-20 left-1/4 w-12 h-12 bg-yellow-300 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
          <div className="absolute right-32 top-40 w-10 h-10 bg-pink-400 rounded-full animate-bounce" style={{ animationDuration: '2s' }}></div>
          <div className="absolute top-60 left-1/3 w-8 h-8 bg-purple-400 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          
          {/* Candy cane */}
          <div className="absolute bottom-12 left-20 transform rotate-12">
            <div className="overflow-hidden relative w-6 h-40 bg-white rounded-full">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="h-6 bg-red-500"></div>
                <div className="h-6 bg-white"></div>
                <div className="h-6 bg-red-500"></div>
                <div className="h-6 bg-white"></div>
                <div className="h-6 bg-red-500"></div>
                <div className="h-6 bg-white"></div>
                <div className="h-6 bg-red-500"></div>
              </div>
            </div>
            <div className="-mt-6 ml-2 w-20 h-6 bg-white rounded-full transform rotate-90"></div>
          </div>
          
          {/* Ice cream */}
          <div className="absolute right-10 bottom-12">
            <div className="overflow-hidden relative w-16 h-16 bg-pink-300 rounded-t-full">
              <div className="absolute top-1 left-1 w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="absolute top-4 left-6 w-4 h-4 bg-red-400 rounded-full"></div>
              <div className="absolute top-2 right-3 w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="absolute bottom-2 left-3 w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            <div className="relative mx-auto -mt-2 w-10 h-16 bg-yellow-200 transform origin-top rotate-3">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-300"></div>
              <div className="absolute left-0 top-3 w-full h-1 bg-yellow-300"></div>
              <div className="absolute left-0 top-6 w-full h-1 bg-yellow-300"></div>
              <div className="absolute left-0 top-9 w-full h-1 bg-yellow-300"></div>
              <div className="absolute left-0 top-12 w-full h-1 bg-yellow-300"></div>
            </div>
          </div>
        </>
      );
    case 'tropical':
      return (
        <>
          <Umbrella className="absolute bottom-16 left-1/4 w-20 h-20 text-yellow-400" />
          <div className="absolute top-20 right-20 w-20 h-20 bg-orange-500 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-24 right-1/4 transform rotate-12">
            <div className="w-4 h-32 bg-green-700 -rotate-6"></div>
            <div className="-mt-8 -ml-8 w-20 h-10 bg-green-500 rounded-full transform -rotate-45"></div>
            <div className="-mt-6 -ml-8 w-20 h-10 bg-green-500 rounded-full transform -rotate-15"></div>
            <div className="-mt-6 -ml-8 w-20 h-10 bg-green-500 rounded-full transform rotate-15"></div>
            <div className="-mt-6 -ml-8 w-20 h-10 bg-green-500 rounded-full transform rotate-45"></div>
          </div>
        </>
      );
    case 'space':
      return (
        <>
          <div className="overflow-hidden absolute top-0 left-0 w-full h-full">
            {Array(50).fill().map((_, i) => (
              <Star 
                key={i}
                className="absolute text-white" 
                style={{
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.4 + Math.random() * 0.6,
                  width: `${8 + Math.random() * 12}px`,
                  height: `${8 + Math.random() * 12}px`,
                  filter: `drop-shadow(0 0 ${2 + Math.random() * 4}px white)`
                }}
              />
            ))}
            
            {/* Planets */}
            <div className="overflow-hidden absolute top-20 right-1/4 w-20 h-20 bg-purple-600 rounded-full">
              <div className="absolute top-2 left-3 w-6 h-2 bg-purple-400 rounded-full transform rotate-12"></div>
              <div className="absolute right-2 top-8 w-8 h-3 bg-purple-400 rounded-full transform -rotate-12"></div>
              <div className="absolute bottom-4 left-5 w-7 h-2 bg-purple-400 rounded-full"></div>
              <div className="absolute w-full h-20 bg-black opacity-20"></div>
            </div>
            
            <div className="absolute top-2/3 w-12 h-12 bg-cyan-400 rounded-full left-1/5">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-cyan-200 opacity-50 transform rotate-45"></div>
            </div>
            
            {/* Rocket */}
            <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2">
              <div className="relative w-8 h-16 bg-red-500 rounded-t-full">
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-8 h-4 bg-orange-400 rounded-b-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-4 h-8 bg-orange-400 rounded-b-full transform origin-bottom -rotate-45"></div>
                <div className="absolute right-0 bottom-0 w-4 h-8 bg-orange-400 rounded-b-full transform origin-bottom rotate-45"></div>
              </div>
            </div>
            
            {/* Shooting stars */}
            <div className="absolute h-0.5 bg-white w-24 transform rotate-12 animate-ping opacity-0 filter blur-sm" 
              style={{ 
                top: '15%', 
                left: '30%', 
                animationDuration: '7s',
                animationDelay: `${phase % 7}s`,
                animationIterationCount: 'infinite'
              }} 
            />
            
            <div className="absolute h-0.5 bg-white w-32 transform -rotate-12 animate-ping opacity-0 filter blur-sm" 
              style={{ 
                top: '35%', 
                left: '65%', 
                animationDuration: '8s',
                animationDelay: `${(phase + 3) % 8}s`,
                animationIterationCount: 'infinite'
              }} 
            />
          </div>
        </>
      );
    case 'sunset':
      return (
        <>
          <div className="absolute bottom-0 w-full">
            <div className="absolute bottom-20 w-full">
              <MountainSnow className="absolute bottom-0 left-1/4 w-64 h-64 text-gray-800 opacity-80" />
              <MountainSnow className="absolute bottom-10 right-1/4 w-48 h-48 text-gray-800 opacity-80" />
            </div>
            <div className="absolute bottom-32 left-1/2 w-32 h-32 bg-orange-500 rounded-full opacity-70 blur-xl transform -translate-x-1/2"></div>
          </div>
        </>
      );
    case 'rainbow':
      return <Rainbow />;
    case 'ocean':
      return (
        <>
          <div className="absolute bottom-0 w-full h-1/2 bg-blue-600 opacity-70"></div>
          <div className="overflow-hidden absolute top-0 left-0 w-full h-full">
            {Array(15).fill().map((_, i) => (
              <div
                key={i}
                className="absolute bg-cyan-200 rounded-full animate-ping"
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  top: `${40 + Math.random() * 55}%`,
                  left: `${Math.random() * 90 + 5}%`,
                  opacity: 0.3 + Math.random() * 0.4,
                  animationDuration: `${Math.random() * 6 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  filter: 'blur(1px)'
                }}
              />
            ))}
            {Array(3).fill().map((_, i) => (
              <Fish 
                key={i}
                className="absolute text-cyan-100" 
                style={{
                  width: `${(i + 2) * 10}px`,
                  height: `${(i + 2) * 10}px`,
                  top: `${60 + i * 10}%`,
                  left: `${(phase * (i + 1) * 0.5) % 100}%`,
                  transform: `scaleX(${Math.sin(phase * 0.1 * (i + 1)) > 0 ? 1 : -1})`,
                  filter: 'drop-shadow(0 0 2px cyan)'
                }}
              />
            ))}
          </div>
        </>
      );
    case 'jungle':
      return (
        <>
          <div className="absolute bottom-32 w-full">
            {/* Palm trees */}
            <div className="absolute bottom-0 left-20">
              <div className="w-8 h-48 bg-yellow-800 transform rotate-3"></div>
              <div className="-mt-10 -ml-12 w-32 h-12 bg-green-600 rounded-full transform -rotate-45"></div>
              <div className="-mt-8 -ml-12 w-32 h-12 bg-green-600 rounded-full transform -rotate-15"></div>
              <div className="-mt-8 -ml-12 w-32 h-12 bg-green-600 rounded-full transform rotate-5"></div>
              <div className="-mt-8 -ml-12 w-32 h-12 bg-green-600 rounded-full transform rotate-25"></div>
            </div>
            
            <div className="absolute bottom-0 right-20">
              <div className="w-8 h-56 bg-yellow-800 transform -rotate-3"></div>
              <div className="-mt-10 -ml-12 w-32 h-12 bg-green-600 rounded-full transform -rotate-25"></div>
              <div className="-mt-8 -ml-12 w-32 h-12 bg-green-600 rounded-full transform -rotate-10"></div>
              <div className="-mt-8 -ml-12 w-32 h-12 bg-green-600 rounded-full transform rotate-10"></div>
              <div className="-mt-8 -ml-12 w-32 h-12 bg-green-600 rounded-full transform rotate-25"></div>
            </div>
            
            {/* Jungle vines */}
            <div className="absolute top-0 left-40 w-2 h-64 bg-green-700 rounded-full transform origin-top rotate-3"></div>
            <div className="absolute top-10 left-40 w-20 h-6 bg-green-600 rounded-full transform -rotate-5"></div>
            <div className="absolute top-24 left-36 w-16 h-6 bg-green-600 rounded-full transform rotate-10"></div>
            <div className="absolute top-40 w-20 h-6 bg-green-600 rounded-full transform left-42 -rotate-8"></div>
            
            <div className="absolute top-0 right-40 w-2 h-72 bg-green-700 rounded-full transform origin-top -rotate-5"></div>
            <div className="absolute top-14 right-36 w-20 h-6 bg-green-600 rounded-full transform rotate-10"></div>
            <div className="absolute top-32 w-16 h-6 bg-green-600 rounded-full transform -rotate-12 right-42"></div>
            <div className="absolute w-20 h-6 bg-green-600 rounded-full transform top-50 right-38 rotate-5"></div>
          </div>
        </>
      );
    case 'magic':
      return (
        <>
          <div className="overflow-hidden absolute top-0 left-0 w-full h-full">
            {Array(30).fill().map((_, i) => (
              <div
                key={i}
                className={`absolute bg-white rounded-full animate-ping`}
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  top: `${Math.random() * 90}%`,
                  left: `${Math.random() * 90 + 5}%`,
                  opacity: 0.4 + Math.random() * 0.6,
                  animationDuration: `${Math.random() * 4 + 1}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  filter: `drop-shadow(0 0 2px ${i % 5 === 0 ? 'pink' : i % 5 === 1 ? 'purple' : i % 5 === 2 ? 'blue' : i % 5 === 3 ? 'cyan' : 'white'})`
                }}
              />
            ))}
            
            <Sparkles className="absolute top-20 left-1/4 w-12 h-12 text-white animate-pulse" style={{ animationDuration: '2s', filter: 'drop-shadow(0 0 5px white)' }} />
            <Sparkles className="absolute top-40 right-1/4 w-16 h-16 text-white animate-pulse" style={{ animationDuration: '3s', filter: 'drop-shadow(0 0 5px white)' }} />
            <Music className="absolute top-60 left-1/3 w-10 h-10 text-white animate-bounce" style={{ animationDuration: '4s', filter: 'drop-shadow(0 0 3px white)' }} />
          </div>
        </>
      );
    default:
      return null;
  }
};

export default function BackgroundWithSettings({ selectedTheme = 'candy' }) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [cloudPositions, setCloudPositions] = useState(
    Array.from({ length: 5 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 30,
      size: Math.random() * 0.5 + 0.5
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => prev + 0.1);
      setCloudPositions(prev =>
        prev.map(cloud => ({
          ...cloud,
          x: (cloud.x + 0.1) % 100
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden fixed inset-0">
      <div className={`absolute inset-0 transition-all duration-500 ${themes[selectedTheme].background}`}>
        <ThemeElements theme={selectedTheme} phase={animationPhase} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r to-transparent from-black/10" />
      <div className="absolute inset-0 bg-gradient-to-l to-transparent from-black/10" />
    </div>
  );
} 