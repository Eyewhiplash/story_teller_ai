import { useState, useRef, useEffect } from 'react'

export default function DrawingPad() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#FF6B6B')
  const [brushSize, setBrushSize] = useState(5)
  const [ctx, setCtx] = useState(null)
  const [tool, setTool] = useState('brush')
  const [shapeImages, setShapeImages] = useState({})
  const [rotation, setRotation] = useState(0)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [lastShape, setLastShape] = useState(null)

  const colors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Light Gray', value: '#E0E0E0' },
    { name: 'Gray', value: '#9E9E9E' },
    { name: 'Black', value: '#000000' },
    // Reds
    { name: 'Light Red', value: '#FFB6B6' },
    { name: 'Red', value: '#FF6B6B' },
    { name: 'Dark Red', value: '#FF0000' },
    // Oranges
    { name: 'Light Orange', value: '#FFB74D' },
    { name: 'Orange', value: '#FF9800' },
    { name: 'Dark Orange', value: '#F57C00' },
    // Yellows
    { name: 'Light Yellow', value: '#FFF176' },
    { name: 'Yellow', value: '#FFE66D' },
    { name: 'Dark Yellow', value: '#FFD54F' },
    // Greens
    { name: 'Light Green', value: '#81C784' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Dark Green', value: '#388E3C' },
    // Blues
    { name: 'Light Blue', value: '#64B5F6' },
    { name: 'Blue', value: '#4ECDC4' },
    { name: 'Dark Blue', value: '#1976D2' },
    // Purples
    { name: 'Light Purple', value: '#BA68C8' },
    { name: 'Purple', value: '#9C27B0' },
    { name: 'Dark Purple', value: '#7B1FA2' },
    // Pinks
    { name: 'Light Pink', value: '#F48FB1' },
    { name: 'Pink', value: '#E91E63' },
    { name: 'Dark Pink', value: '#C2185B' },
    { name: 'Brown', value: '#795548' },
    { name: 'Rainbow', value: 'rainbow' }
  ]

  const tools = [
    { id: 'brush', name: 'Brush', icon: '🖌️', description: 'Smooth drawing' },
    { id: 'pencil', name: 'Pencil', icon: '✏️', description: 'Sharp lines' },
    { id: 'crayon', name: 'Crayon', icon: '🖍️', description: 'Waxy texture' },
    { id: 'spray', name: 'Spray', icon: '💨', description: 'Spray paint' },
    { id: 'eraser', name: 'Eraser', icon: '🧹', description: 'Erase mistakes' },
    { id: 'star', name: 'Star', icon: '⭐', description: 'Draw a star' },
    { id: 'heart', name: 'Heart', icon: '❤️', description: 'Draw a heart' },
    { id: 'sun', name: 'Sun', icon: '☀️', description: 'Draw a sun' },
    { id: 'tree', name: 'Tree', icon: '🌳', description: 'Draw a tree' },
    { id: 'cat', name: 'Cat', icon: '🐱', description: 'Draw a cat' },
    { id: 'rabbit', name: 'Rabbit', icon: '🐰', description: 'Draw a rabbit' },
    { id: 'bird', name: 'Bird', icon: '🐦', description: 'Draw a bird' },
    { id: 'ball', name: 'Ball', icon: '⚽', description: 'Draw a ball' },
    { id: 'house', name: 'House', icon: '🏠', description: 'Draw a house' },
    { id: 'flower', name: 'Flower', icon: '🌸', description: 'Draw a flower' }
  ]

  // Load all shape images
  useEffect(() => {
    const shapes = ['star', 'heart', 'sun', 'tree', 'cat', 'rabbit', 'bird', 'ball', 'house', 'flower']
    const loadedImages = {}
    
    shapes.forEach(shape => {
      const img = new Image()
      img.src = `/src/assets/shapes/${shape}.png`
      img.onload = () => {
        loadedImages[shape] = img
        setShapeImages(prev => ({ ...prev, [shape]: img }))
      }
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    // Set up canvas scaling
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    // Set display size (css pixels)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    // Scale context to ensure correct drawing operations
    context.scale(dpr, dpr)
    
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = color
    context.lineWidth = brushSize
    setCtx(context)
  }, []) // Only run once when component mounts

  // Separate effect for updating color and brush size
  useEffect(() => {
    if (ctx) {
      if (color === 'rainbow') {
        const hue = (Date.now() / 20) % 360
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
      } else {
        ctx.strokeStyle = color
      }
      ctx.lineWidth = brushSize
    }
  }, [color, brushSize, ctx])

  // Save canvas state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Undo last action
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
    }
  }

  // Redo last undone action
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
    }
  }

  // Rotate shape
  const rotateShape = () => {
    setRotation((prev) => (prev + 45) % 360)
  }

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return { x, y }
  }

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e)
    
    // Check if the tool is a shape tool
    if (shapeImages[tool]) {
      drawShape(x, y)
      saveToHistory()
      return
    }

    // For drawing tools, start the path
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const drawShape = (x, y) => {
    const sizeMultipliers = {
      house: 20,
      cat: 14,
      rabbit: 12,
      bird: 10,
      ball: 8,
      tree: 16,
      flower: 6,
      sun: 18,
      heart: 8,
      star: 10
    }

    const size = brushSize * (sizeMultipliers[tool] || 10)
    
    // Save the current canvas state
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    
    // Restore the previous state
    ctx.putImageData(imageData, 0, 0)
    
    // Draw the new shape
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(shapeImages[tool], -size/2, -size/2, size, size)
    ctx.restore()

    // Save the shape info for later rotation
    setLastShape({
      x,
      y,
      size,
      tool,
      rotation
    })
  }

  const rotateLastShape = () => {
    if (!lastShape) return

    // Get the current canvas state before the last shape was drawn
    const previousState = history[historyIndex - 1]
    if (!previousState) return

    // Restore the canvas to the state before the last shape
    ctx.putImageData(previousState, 0, 0)
    
    // Update rotation
    const newRotation = (lastShape.rotation + 45) % 360
    setRotation(newRotation)
    
    // Draw the shape with new rotation
    ctx.save()
    ctx.translate(lastShape.x, lastShape.y)
    ctx.rotate((newRotation * Math.PI) / 180)
    ctx.drawImage(shapeImages[lastShape.tool], -lastShape.size/2, -lastShape.size/2, lastShape.size, lastShape.size)
    ctx.restore()

    // Update last shape with new rotation
    setLastShape(prev => ({
      ...prev,
      rotation: newRotation
    }))

    // Update history with the new state
    const newImageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    const newHistory = history.slice(0, historyIndex)
    newHistory.push(newImageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const { x, y } = getCoordinates(e)
    
    // Handle rainbow color
    if (color === 'rainbow') {
      const hue = (Date.now() / 10) % 360
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
    } else {
      ctx.strokeStyle = color
    }

    switch (tool) {
      case 'brush':
        ctx.lineTo(x, y)
        ctx.stroke()
        break
      case 'pencil':
        ctx.lineWidth = 1
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.lineWidth = brushSize
        break
      case 'crayon':
        // Create a waxy texture effect
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize
          const offsetY = (Math.random() - 0.5) * brushSize
          ctx.beginPath()
          ctx.moveTo(x + offsetX, y + offsetY)
          ctx.lineTo(x + offsetX + (Math.random() - 0.5) * 2, y + offsetY + (Math.random() - 0.5) * 2)
          ctx.stroke()
        }
        break
      case 'spray':
        // Create spray paint effect
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * brushSize * 2
          const sprayX = x + Math.cos(angle) * radius
          const sprayY = y + Math.sin(angle) * radius
          ctx.fillRect(sprayX, sprayY, 1, 1)
        }
        break
      case 'eraser':
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineTo(x, y)
        ctx.stroke()
        break
      default:
        ctx.lineTo(x, y)
        ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      ctx.closePath()
      setIsDrawing(false)
      saveToHistory()
    }
  }

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    saveToHistory()
  }

  return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen bg-transparent to-40%">
      <div className="p-6 w-full max-w-[1200px] bg-transparent rounded-xl shadow-lg">
        <div className="flex flex-col gap-6">
          {/* Top section - Tools and Colors */}
          <div className="flex flex-wrap gap-6 justify-center">
            {/* Tools */}
            <div className="space-y-4">
              <h2 className="mb-2 text-xl font-bold text-gray-800">Tools</h2>
              <div className="grid grid-cols-8 gap-2">
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      tool === t.id
                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h2 className="mb-2 text-xl font-bold text-gray-800">Colors</h2>
              <div className="grid grid-cols-8 gap-1">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.value)}
                    className={`p-1 rounded-lg transition-all ${
                      color === c.value
                        ? 'ring-2 ring-blue-500'
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                    title={c.name}
                  >
                    {c.name === 'Rainbow' ? (
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 rounded-full"></div>
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: c.value }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full max-w-[800px] h-[600px] bg-white rounded-lg border-2 border-gray-300"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
            />
          </div>

          {/* Bottom controls */}
          <div className="flex gap-6 justify-center items-center">
            <div className="flex gap-4 items-center">
              <span className="text-sm font-medium text-gray-700">Brush Size</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600">{brushSize}px</span>
            </div>
            <button
              onClick={rotateLastShape}
              disabled={!lastShape}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                lastShape ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Rotate Last Shape
            </button>
            <button
              onClick={undo}
              className="px-4 py-2 text-white bg-gray-500 rounded-lg transition-colors hover:bg-gray-600"
            >
              Undo
            </button>
            <button
              onClick={redo}
              className="px-4 py-2 text-white bg-gray-500 rounded-lg transition-colors hover:bg-gray-600"
            >
              Redo
            </button>
            <button
              onClick={clearCanvas}
              className="px-4 py-2 text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
            >
              Clear Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 