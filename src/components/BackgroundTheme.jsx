import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Star, Moon, Bird, Fish, Rabbit, MountainSnow, Umbrella, Music, Sparkles } from 'lucide-react';

// Custom components for more vibrant visuals
const Rainbow = () => (
  <div className="absolute top-0 left-0 w-full h-64 overflow-hidden">
    <div className="absolute w-full h-64 top-20 left-0 opacity-60">
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

const CandyCane = () => (
  <div className="absolute bottom-12 left-20 transform rotate-12">
    <div className="w-6 h-40 bg-white rounded-full overflow-hidden relative">
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
    <div className="w-20 h-6 bg-white rounded-full -mt-6 ml-2 transform rotate-90"></div>
  </div>
);

const IceCream = () => (
  <div className="absolute bottom-12 right-10">
    <div className="w-16 h-16 bg-pink-300 rounded-t-full relative overflow-hidden">
      <div className="absolute top-1 left-1 w-3 h-3 bg-red-400 rounded-full"></div>
      <div className="absolute top-4 left-6 w-4 h-4 bg-red-400 rounded-full"></div>
      <div className="absolute top-2 right-3 w-3 h-3 bg-red-400 rounded-full"></div>
      <div className="absolute bottom-2 left-3 w-3 h-3 bg-red-400 rounded-full"></div>
    </div>
    <div className="w-10 h-16 bg-yellow-200 -mt-2 mx-auto transform rotate-3 origin-top relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-300"></div>
      <div className="absolute top-3 left-0 w-full h-1 bg-yellow-300"></div>
      <div className="absolute top-6 left-0 w-full h-1 bg-yellow-300"></div>
      <div className="absolute top-9 left-0 w-full h-1 bg-yellow-300"></div>
      <div className="absolute top-12 left-0 w-full h-1 bg-yellow-300"></div>
    </div>
  </div>
);

const Sheep = ({ className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="w-14 h-8 bg-white rounded-t-full shadow-inner"></div>
    <div className="w-14 h-8 bg-white rounded-b-full -mt-2 shadow-lg"></div>
    <div className="w-5 h-7 bg-gray-800 rounded-full absolute -top-2 -right-1"></div>
    <div className="w-3 h-5 bg-black rounded-full absolute -bottom-3 left-3"></div>
    <div className="w-3 h-5 bg-black rounded-full absolute -bottom-3 right-3"></div>
    <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-0"></div>
  </div>
);

export default function BackgroundTheme() {
  const [theme, setTheme] = useState('candy');
  const [animationPhase, setAnimationPhase] = useState(0);
  const [cloudPositions, setCloudPositions] = useState([
    { x: 10, y: 20, speed: 0.1, size: 1.2 },
    { x: 40, y: 30, speed: 0.15, size: 0.9 },
    { x: 70, y: 15, speed: 0.08, size: 1.5 }
  ]);
  const [starTwinkles, setStarTwinkles] = useState(Array(20).fill().map(() => Math.random()));
  
  // Ultra vibrant theme backgrounds with gradients and patterns
  const backgrounds = {
    candy: 'bg-gradient-to-b from-pink-400 via-fuchsia-400 to-purple-400',
    tropical: 'bg-gradient-to-b from-yellow-300 via-orange-300 to-red-400',
    space: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-fuchsia-900',
    sunset: 'bg-gradient-to-b from-orange-400 via-red-500 to-purple-600',
    rainbow: 'bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400',
    ocean: 'bg-gradient-to-b from-cyan-300 via-blue-500 to-indigo-700',
    jungle: 'bg-gradient-to-b from-green-400 via-emerald-500 to-teal-600',
    magic: 'bg-gradient-to-b from-violet-500 via-purple-500 to-indigo-600'
  };

  // Update animations
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100);
      
      // Move clouds
      setCloudPositions(prev => 
        prev.map(cloud => ({
          ...cloud,
          x: (cloud.x + cloud.speed) % 100
        }))
      );
      
      // Twinkle stars
      setStarTwinkles(prev => 
        prev.map(() => Math.random())
      );
    }, 100);
    
    return () => clearInterval(animationTimer);
  }, []);

  // Theme-specific elements
  const ThemeElements = () => {
    switch(theme) {
      case 'candy':
        return (
          <>
            <CandyCane />
            <IceCream />
            <div className="absolute top-20 left-1/4 w-12 h-12 bg-yellow-300 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
            <div className="absolute top-40 right-32 w-10 h-10 bg-pink-400 rounded-full animate-bounce" style={{ animationDuration: '2s' }}></div>
            <div className="absolute top-60 left-1/3 w-8 h-8 bg-purple-400 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          </>
        );
      case 'tropical':
        return (
          <>
            <Umbrella className="absolute bottom-16 left-1/4 text-yellow-400 w-20 h-20" />
            <div className="absolute top-20 right-20 w-20 h-20 bg-orange-500 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-24 right-1/4 transform rotate-12">
              <div className="w-4 h-32 bg-green-700 -rotate-6"></div>
              <div className="w-20 h-10 bg-green-500 -mt-8 -ml-8 rounded-full transform -rotate-45"></div>
              <div className="w-20 h-10 bg-green-500 -mt-6 -ml-8 rounded-full transform -rotate-15"></div>
              <div className="w-20 h-10 bg-green-500 -mt-6 -ml-8 rounded-full transform rotate-15"></div>
              <div className="w-20 h-10 bg-green-500 -mt-6 -ml-8 rounded-full transform rotate-45"></div>
            </div>
          </>
        );
      case 'space':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              {Array(50).fill().map((_, i) => (
                <Star 
                  key={i}
                  className="absolute text-white" 
                  style={{
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.4 + starTwinkles[i % starTwinkles.length] * 0.6,
                    width: `${8 + Math.random() * 12}px`,
                    height: `${8 + Math.random() * 12}px`,
                    filter: `drop-shadow(0 0 ${2 + starTwinkles[i % starTwinkles.length] * 4}px white)`
                  }}
                />
              ))}
              
              {/* Planets */}
              <div className="absolute top-20 right-1/4 w-20 h-20 rounded-full bg-purple-600 overflow-hidden">
                <div className="absolute top-2 left-3 w-6 h-2 bg-purple-400 rounded-full transform rotate-12"></div>
                <div className="absolute top-8 right-2 w-8 h-3 bg-purple-400 rounded-full transform -rotate-12"></div>
                <div className="absolute bottom-4 left-5 w-7 h-2 bg-purple-400 rounded-full"></div>
                <div className="absolute w-full h-20 bg-black opacity-20"></div>
              </div>
              
              <div className="absolute top-2/3 left-1/5 w-12 h-12 rounded-full bg-cyan-400">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-cyan-200 opacity-50 transform rotate-45"></div>
              </div>
              
              {/* Shooting stars */}
              <div className="absolute h-0.5 bg-white w-24 transform rotate-12 animate-ping opacity-0 filter blur-sm" 
                style={{ 
                  top: '15%', 
                  left: '30%', 
                  animationDuration: '7s',
                  animationDelay: `${animationPhase % 7}s`,
                  animationIterationCount: 'infinite'
                }} 
              />
              
              <div className="absolute h-0.5 bg-white w-32 transform -rotate-12 animate-ping opacity-0 filter blur-sm" 
                style={{ 
                  top: '35%', 
                  left: '65%', 
                  animationDuration: '8s',
                  animationDelay: `${(animationPhase + 3) % 8}s`,
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
                <MountainSnow className="absolute bottom-0 left-1/4 text-gray-800 w-64 h-64 opacity-80" />
                <MountainSnow className="absolute bottom-10 right-1/4 text-gray-800 w-48 h-48 opacity-80" />
              </div>
              <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-orange-500 rounded-full blur-xl opacity-70"></div>
            </div>
          </>
        );
      case 'rainbow':
        return <Rainbow />;
      case 'ocean':
        return (
          <>
            <div className="absolute bottom-0 w-full h-1/2 bg-blue-600 opacity-70"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              {Array(15).fill().map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-cyan-200 animate-ping"
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
                    left: `${(animationPhase * (i + 1) * 0.5) % 100}%`,
                    transform: `scaleX(${Math.sin(animationPhase * 0.1 * (i + 1)) > 0 ? 1 : -1})`,
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
                <div className="w-32 h-12 bg-green-600 -mt-10 -ml-12 rounded-full transform -rotate-25"></div>
                <div className="w-32 h-12 bg-green-600 -mt-8 -ml-12 rounded-full transform -rotate-15"></div>
                <div className="w-32 h-12 bg-green-600 -mt-8 -ml-12 rounded-full transform rotate-5"></div>
                <div className="w-32 h-12 bg-green-600 -mt-8 -ml-12 rounded-full transform rotate-25"></div>
              </div>
              
              <div className="absolute bottom-0 right-20">
                <div className="w-8 h-56 bg-yellow-800 transform -rotate-3"></div>
                <div className="w-32 h-12 bg-green-600 -mt-10 -ml-12 rounded-full transform -rotate-25"></div>
                <div className="w-32 h-12 bg-green-600 -mt-8 -ml-12 rounded-full transform -rotate-10"></div>
                <div className="w-32 h-12 bg-green-600 -mt-8 -ml-12 rounded-full transform rotate-10"></div>
                <div className="w-32 h-12 bg-green-600 -mt-8 -ml-12 rounded-full transform rotate-25"></div>
              </div>
              
              {/* Jungle vines */}
              <div className="absolute top-0 left-40 w-2 h-64 bg-green-700 rounded-full transform rotate-3 origin-top"></div>
              <div className="absolute top-10 left-40 w-20 h-6 bg-green-600 rounded-full transform -rotate-5"></div>
              <div className="absolute top-24 left-36 w-16 h-6 bg-green-600 rounded-full transform rotate-10"></div>
              <div className="absolute top-40 left-42 w-20 h-6 bg-green-600 rounded-full transform -rotate-8"></div>
              
              <div className="absolute top-0 right-40 w-2 h-72 bg-green-700 rounded-full transform -rotate-5 origin-top"></div>
              <div className="absolute top-14 right-36 w-20 h-6 bg-green-600 rounded-full transform rotate-10"></div>
              <div className="absolute top-32 right-42 w-16 h-6 bg-green-600 rounded-full transform -rotate-12"></div>
              <div className="absolute top-50 right-38 w-20 h-6 bg-green-600 rounded-full transform rotate-5"></div>
            </div>
          </>
        );
      case 'magic':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              {Array(30).fill().map((_, i) => (
                <div 
                  key={i}
                  className={`absolute rounded-full animate-ping bg-white`}
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
              
              <Sparkles className="absolute top-20 left-1/4 text-white w-12 h-12 animate-pulse" style={{ animationDuration: '2s', filter: 'drop-shadow(0 0 5px white)' }} />
              <Sparkles className="absolute top-40 right-1/4 text-white w-16 h-16 animate-pulse" style={{ animationDuration: '3s', filter: 'drop-shadow(0 0 5px white)' }} />
              <Music className="absolute top-60 left-1/3 text-white w-10 h-10 animate-bounce" style={{ animationDuration: '4s', filter: 'drop-shadow(0 0 3px white)' }} />
            </div>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 -z-10">
      <div className={`w-full h-full ${backgrounds[theme]} relative overflow-hidden`}>
        {/* Theme-specific elements */}
        <ThemeElements />
        
        {/* Clouds */}
        {theme !== 'space' && theme !== 'ocean' && (
          <>
            {cloudPositions.map((cloud, i) => (
              <div 
                key={i}
                className="absolute"
                style={{
                  left: `${cloud.x}%`,
                  top: `${cloud.y}%`,
                  transform: `scale(${cloud.size})`,
                  transition: 'left 0.5s linear'
                }}
              >
                <Cloud className={theme === 'sunset' ? 'text-orange-200' : 'text-white'} style={{ width: '48px', height: '48px', opacity: 0.9 }} />
              </div>
            ))}
          </>
        )}
        
        {/* Animals */}
        {(theme !== 'space' && theme !== 'ocean') && (
          <>
            <div 
              className="absolute pointer-events-none"
              style={{
                bottom: '16px',
                left: `${(animationPhase * 0.6) % 100}%`,
                transform: `translateY(${Math.sin(animationPhase * 0.1) * -10}px)`,
                transition: 'all 0.2s ease-out'
              }}
            >
              <Rabbit className="text-gray-100 w-10 h-10 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} />
            </div>
            
            <div 
              className="absolute pointer-events-none"
              style={{
                bottom: '14px',
                right: `${(animationPhase * 0.4) % 100}%`,
                transform: `translateY(${Math.sin(animationPhase * 0.08) * -5}px) scaleX(-1)`,
                transition: 'all 0.3s ease-out'
              }}
            >
              <Sheep className="drop-shadow-lg" />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 