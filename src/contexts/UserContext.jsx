import { createContext, useState, useEffect, useContext } from 'react';

export const UserContext = createContext(null);

// Storage keys
const USER_STORAGE_KEY = 'storyteller_user';
const STORY_STORAGE_KEYS = ['generatedStory', 'selectedCharacter', 'selectedSetting'];

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Loaded user from storage:', userData.username);
        setUser(userData);
      } else {
        console.log('No user found in storage');
      }
    } catch (error) {
      console.error('Failed to parse stored user data', error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Login function
  const login = (userData) => {
    console.log('Logging in user:', userData.username);
    setUser(userData);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to store user data', error);
    }
  };
  
  // Logout function
  const logout = () => {
    console.log('Logout function in UserContext called');
    console.log('Current user before logout:', user);
    
    // Clear all auth-related data
    try {
      // Remove user data
      localStorage.removeItem(USER_STORAGE_KEY);
      console.log('Removed user data from localStorage');
      
      // Also clear any story-related data
      STORY_STORAGE_KEYS.forEach(key => {
        if (localStorage.getItem(key)) {
          console.log(`Clearing ${key} from localStorage`);
          localStorage.removeItem(key);
        }
      });
      
      // Clear any other user-specific data that might be in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('user_') || key.includes('story') || key.includes('auth'))) {
          console.log(`Clearing additional data: ${key}`);
          localStorage.removeItem(key);
        }
      }
      
      // Force update user state to null
      console.log('Setting user state to null');
      setUser(null);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Failed to remove user data', error);
      
      // Even if there's an error, still force the user state to null
      console.log('Setting user state to null (after error)');
      setUser(null);
    }
  };
  
  const contextValue = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access to the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 