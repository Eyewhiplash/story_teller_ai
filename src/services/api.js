/**
 * API service for communicating with the StoryTeller backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Use the same storage key as in UserContext
const USER_STORAGE_KEY = 'storyteller_user';

// Helper to get current user from localStorage
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (!userStr) {
      console.log('No user found in localStorage');
      return null;
    }
    
    const user = JSON.parse(userStr);
    console.log(`User found in localStorage: ${user.username} (ID: ${user.id})`);
    return user;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

/**
 * Get available story prompts from the backend
 * @param {string} language - Optional language filter (en/sv)
 * @param {string} ageGroup - Optional age group filter (3-5, 6-8, 9-12)
 * @returns {Promise} - Array of story prompts
 */
export const getStoryPrompts = async (language, ageGroup) => {
  let url = `${API_URL}/story-prompts`;
  
  // Add query parameters if provided
  const params = new URLSearchParams();
  if (language) params.append('language', language);
  if (ageGroup) params.append('age_group', ageGroup);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching story prompts:', error);
    throw error;
  }
};

/**
 * Generate a story based on provided parameters
 * @param {Object} storyParams - Parameters for story generation
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 * @returns {Promise} - Generated story object
 */
export const generateStory = async (storyParams, requireAuth = true) => {
  const user = getCurrentUser();
  
  if (requireAuth && (!user || !user.id)) {
    throw new Error('Authentication required to generate stories');
  }
  
  try {
    // Include user ID in the request if user is logged in
    const requestBody = {
      ...storyParams,
      user_id: user?.id || null
    };
    
    const response = await fetch(`${API_URL}/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};

/**
 * Get stories from the backend
 * @param {number} userId - Optional user ID filter
 * @param {boolean} isPublic - Optional filter for public stories
 * @returns {Promise} - Array of stories
 */
export const getStories = async (userId, isPublic) => {
  let url = `${API_URL}/stories`;
  
  // Add query parameters if provided
  const params = new URLSearchParams();
  if (userId !== undefined) params.append('user_id', userId);
  if (isPublic !== undefined) params.append('is_public', isPublic);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

/**
 * Get a specific story by ID
 * @param {number} storyId - Story ID
 * @returns {Promise} - Story object
 */
export const getStoryById = async (storyId) => {
  try {
    const response = await fetch(`${API_URL}/stories/${storyId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching story ${storyId}:`, error);
    throw error;
  }
};

/**
 * Save a story
 * @param {number} storyId - Story ID to save
 * @returns {Promise} - Saved story object
 */
export const saveStory = async (storyId) => {
  const user = getCurrentUser();
  
  if (!user || !user.id) {
    throw new Error('Authentication required to save stories');
  }
  
  try {
    const response = await fetch(`${API_URL}/saved-stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        story_id: storyId,
        user_id: user.id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `HTTP error ${response.status}` }));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving story:', error);
    throw error;
  }
}; 