import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useTranslation } from '../hooks/useTranslation'

export default function UserSettings() {
  const { user, logout } = useUser()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const confirmDeleteRef = useRef(null)
  
  useEffect(() => {
    // Add click event listener to detect clicks outside the confirmation dialog
    function handleClickOutside(event) {
      if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(event.target)) {
        setShowConfirmDelete(false)
      }
    }
    
    if (showConfirmDelete) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showConfirmDelete])
  
  if (!user) {
    navigate('/')
    return null
  }

  const handleDeleteAccount = () => {
    if (showConfirmDelete) {
      // In a real application, you would make an API call to delete the account
      // For now, we'll just clear localStorage and redirect
      localStorage.clear()
      window.location.href = '/'
    } else {
      setShowConfirmDelete(true)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('userSettings')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('profile')}</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">{t('username')}</p>
          <p className="font-medium">{user.username}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">{t('email')}</p>
          <p className="font-medium">{user.email}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {!showConfirmDelete ? (
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            {t('deleteMyData')}
          </button>
        ) : (
          <div 
            ref={confirmDeleteRef}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-red-700 mb-4">{t('deleteConfirmation')}</p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('confirmDelete')}
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 