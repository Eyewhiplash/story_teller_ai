import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import AuthModal from './AuthModal';
import { useState, useEffect } from 'react';

/**
 * Protected route component that redirects to login if not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @returns {React.ReactNode} - The rendered component
 */
export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();

  // Show auth modal if not logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, loading]);

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, render the protected content
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, show login message and modal
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-soft max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-4">Login Required</h2>
        <p className="mb-6">You need to login to access the Story Creator.</p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Login Now
        </button>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
} 