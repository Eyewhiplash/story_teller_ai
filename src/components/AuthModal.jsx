import { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { login, register } from '../services/authService'

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login: loginUser } = useUser()

  // Reset form data when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        username: ''
      });
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      if (isLogin) {
        // Login
        const userData = await login(formData.email, formData.password)
        loginUser(userData)
      } else {
        // Register
        const userData = await register(formData.username, formData.email, formData.password)
        loginUser(userData)
      }
      // Close modal on success
      onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay itself, not its children
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    // Reset form when switching modes
    setFormData({
      email: '',
      password: '',
      username: ''
    });
  };

  if (!isOpen) return null

  return (
    <div 
      className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="p-8 mx-4 w-full max-w-md bg-white rounded-2xl shadow-soft">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary">
            {isLogin ? 'Welcome Back!' : 'Join the Adventure!'}
          </h2>
          <p className="text-text">
            {isLogin ? 'Sign in to continue your story journey' : 'Create an account to start creating magical stories'}
          </p>
        </div>

        {error && (
          <div className="relative px-4 py-3 mb-4 text-red-700 bg-red-100 rounded border border-red-400" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block mb-2 font-medium text-text">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="px-4 py-3 w-full rounded-xl border-2 border-gray-200 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Your magical username"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium text-text">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-3 w-full rounded-xl border-2 border-gray-200 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-text">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-4 py-3 w-full rounded-xl border-2 border-gray-200 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 w-full text-lg font-bold text-white rounded-xl transition-colors duration-200 bg-blue-600 hover:bg-blue-700 shadow-md disabled:opacity-70 border-2 border-blue-400"
          >
            {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="transition-colors text-primary hover:text-opacity-80"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
} 