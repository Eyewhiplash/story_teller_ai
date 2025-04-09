import React, { useState, useEffect, useRef } from 'react';

const ChildsCalculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false);
  const [calculationSuccess, setCalculationSuccess] = useState(false);
  const [animatedButton, setAnimatedButton] = useState(null);
  
  // Audio context setup
  const audioContextRef = useRef(null);
  const audioInitializedRef = useRef(false);
  
  // Initialize audio on first interaction
  const initializeAudio = () => {
    if (!audioInitializedRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        audioInitializedRef.current = true;
      } catch (e) {
        console.error("Web Audio API is not supported in this browser", e);
      }
    }
  };
  
  // Musical notes for a C major scale (do re mi fa sol la ti do) and their frequencies
  const musicalNotes = {
    'C5': 523.25, // do (high)
    'B4': 493.88, // ti
    'A4': 440.00, // la
    'G4': 392.00, // sol
    'F4': 349.23, // fa
    'E4': 329.63, // mi
    'D4': 293.66, // re
    'C4': 261.63, // do (middle C)
    'B3': 246.94, // ti (low)
    'A3': 220.00, // la (low)
    'G3': 196.00, // sol (low)
    'F3': 174.61  // fa (low)
  };
  
  // Play musical notes for buttons
  const playSound = (type) => {
    // Initialize audio on first button press
    initializeAudio();
    
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine'; // Use sine wave for a clean musical tone
    
    // Assign musical notes to different buttons
    let note = 'C4'; // default note (middle C)
    
    // Descending scale for numbers 9 to 0
    if (type === 'num-9') note = 'C5';      // do (high)
    else if (type === 'num-8') note = 'B4';  // ti
    else if (type === 'num-7') note = 'A4';  // la
    else if (type === 'num-6') note = 'G4';  // sol
    else if (type === 'num-5') note = 'F4';  // fa
    else if (type === 'num-4') note = 'E4';  // mi
    else if (type === 'num-3') note = 'D4';  // re
    else if (type === 'num-2') note = 'C4';  // do (middle)
    else if (type === 'num-1') note = 'B3';  // ti (low)
    else if (type === 'num-0') note = 'A3';  // la (low)
    
    // Special buttons using the same musical scale
    else if (type === 'clear') note = 'G3';  // sol (low)
    else if (type === 'op-+') note = 'F4';   // fa (same as 5)
    else if (type === 'op--') note = 'A4';   // la (same as 7)
    else if (type === 'equals') note = 'C5'; // do (high - same as 9)
    
    // Set the frequency based on the note
    oscillator.frequency.setValueAtTime(musicalNotes[note], context.currentTime);
    
    // Set volume and duration
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
    
    // Connect and play
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  };
  
  // Button animation handling
  const animateButton = (buttonId) => {
    setAnimatedButton(buttonId);
    setTimeout(() => setAnimatedButton(null), 300);
  };
  
  // Button press handler
  const inputDigit = (digit) => {
    if (waitingForSecondNumber) {
      setDisplayValue(digit);
      setWaitingForSecondNumber(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
    playSound(`num-${digit}`);
    animateButton(`num-${digit}`);
  };
  
  // Clear calculator
  const clearDisplay = () => {
    setDisplayValue('0');
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecondNumber(false);
    playSound('clear');
    animateButton('clear');
  };
  
  // Handle operator
  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(displayValue);
    
    if (firstNumber === null) {
      setFirstNumber(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplayValue(String(result));
      setFirstNumber(result);
    }
    
    setWaitingForSecondNumber(true);
    setOperator(nextOperator);
    playSound('operator');
    animateButton(`op-${nextOperator}`);
  };
  
  // Perform calculation
  const performCalculation = () => {
    const inputValue = parseFloat(displayValue);
    
    if (operator === '+') {
      return firstNumber + inputValue;
    } else if (operator === '-') {
      return Math.max(0, firstNumber - inputValue); // Prevent negative numbers for children
    }
    
    return inputValue;
  };
  
  // Equals button handler
  const handleEquals = () => {
    if (!firstNumber || !operator) {
      return;
    }
    
    const result = performCalculation();
    setDisplayValue(String(result));
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecondNumber(false);
    playSound('equals');
    animateButton('equals');
    
    // Show success animation
    setCalculationSuccess(true);
    setTimeout(() => {
      setCalculationSuccess(false);
    }, 2000);
  };
  
  // Number buttons
  const renderNumberButtons = () => {
    const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
    const colors = [
      'bg-red-400', 'bg-orange-400', 'bg-yellow-400',
      'bg-green-400', 'bg-teal-400', 'bg-blue-400',
      'bg-indigo-400', 'bg-purple-400', 'bg-pink-400',
      'bg-gray-400'
    ];
    
    return (
      <div className="grid grid-cols-3 gap-3 mb-3">
        {numbers.map((num, index) => (
          <button 
            key={num} 
            onClick={() => inputDigit(num)}
            className={`${colors[index]} text-white text-2xl font-bold rounded-xl h-16 shadow-md hover:shadow-lg transition-all
              ${animatedButton === `num-${num}` ? 'animate-bounce' : 'hover:scale-105'}`}
            style={{ boxShadow: '0 4px 0 0 rgba(0,0,0,0.2)' }}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen">
      <div className="p-6 w-full max-w-md rounded-3xl shadow-2xl backdrop-blur-sm bg-white/20">
        <h1 className="mb-4 text-3xl font-bold text-center text-purple-600">Miniräknare</h1>
        
        {/* Display */}
        <div className="flex overflow-hidden relative justify-end items-center p-4 mb-6 h-20 bg-gradient-to-r rounded-xl backdrop-blur-sm from-green-100/50 to-blue-100/50">
          <span className="text-4xl font-bold text-gray-800">{displayValue}</span>
          
          {/* Correct animation */}
          {calculationSuccess && (
            <div className="flex absolute inset-0 justify-center items-center">
              <div className="p-4 rounded-full backdrop-blur-sm animate-pulse bg-green-500/60">
                <span className="text-4xl text-white">✓</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Keypad */}
        <div className="flex gap-4">
          <div className="flex-1">
            {renderNumberButtons()}
          </div>
          
          <div className="flex flex-col gap-3 w-20">
            <button 
              onClick={clearDisplay}
              className={`bg-red-500 text-white text-xl font-bold rounded-xl h-16 shadow-md hover:shadow-lg transition-all
                ${animatedButton === 'clear' ? 'animate-bounce' : 'hover:scale-105'}`}
              style={{ boxShadow: '0 4px 0 0 rgba(0,0,0,0.2)' }}
            >
              Clr
            </button>
            <button 
              onClick={() => handleOperator('+')}
              className={`bg-purple-500 text-white text-3xl font-bold rounded-xl h-16 shadow-md hover:shadow-lg transition-all
                ${animatedButton === 'op-+' ? 'animate-bounce' : 'hover:scale-105'}`}
              style={{ boxShadow: '0 4px 0 0 rgba(0,0,0,0.2)' }}
            >
              +
            </button>
            <button 
              onClick={() => handleOperator('-')}
              className={`bg-yellow-500 text-white text-3xl font-bold rounded-xl h-16 shadow-md hover:shadow-lg transition-all
                ${animatedButton === 'op--' ? 'animate-bounce' : 'hover:scale-105'}`}
              style={{ boxShadow: '0 4px 0 0 rgba(0,0,0,0.2)' }}
            >
              -
            </button>
            <button 
              onClick={handleEquals}
              className={`bg-green-500 text-white text-3xl font-bold rounded-xl h-16 shadow-md hover:shadow-lg transition-all
                ${animatedButton === 'equals' ? 'animate-bounce' : 'hover:scale-105'}`}
              style={{ boxShadow: '0 4px 0 0 rgba(0,0,0,0.2)' }}
            >
              =
            </button>
          </div>
        </div>
        
        {/* Current operation display */}
        <div className="mt-4 text-center">
          <p className="text-lg text-purple-700">
            {firstNumber !== null && `${firstNumber} ${operator} ${waitingForSecondNumber ? '' : displayValue}`}
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-300 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
      <div className="absolute right-10 bottom-10 w-20 h-20 bg-purple-300 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-20 right-20 w-12 h-12 bg-pink-300 rounded-full animate-bounce" style={{ animationDuration: '2.5s' }}></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-300 rounded-full animate-pulse" style={{ animationDuration: '3.5s' }}></div>
    </div>
  );
};

export default ChildsCalculator;