import { jwtDecode } from 'jwt-decode';

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

// Utility function to create headers with auth
const createAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Verify and decode Supabase token 
export const verifySupabaseToken = (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    // Decode the token (note: this doesn't verify signature on frontend)
    const payload = jwtDecode(token);
    
    console.log("Decoded payload:", payload);

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      throw new Error("Token has expired");
    }

    // Debug: Check for metadata existence
    if (payload.app_metadata) {
      console.log("app_metadata exists:", payload.app_metadata);
    } else {
      console.log("app_metadata does not exist");
    }

    if (payload.user_metadata) {
      console.log("user_metadata exists:", payload.user_metadata);
    } else {
      console.log("user_metadata does not exist");
    }

    const user_metadata = payload.user_metadata || {};
    
    // Return user information 
    return {
      user_id: payload.sub,  // User ID
      email: payload.email,
      display_name: user_metadata.display_name,
      role: payload.role || "authenticated",
      aud: payload.aud,
      exp: payload.exp,
      iat: payload.iat,
      // Include any custom claims you might have
      app_metadata: payload.app_metadata || {},
      user_metadata: payload.user_metadata || {},
    };
    
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

// Extract user metadata (similar to backend function)
export const extractUserMetadata = (userInfo) => {
  return {
    id: userInfo.user_id,
    email: userInfo.email,
    display_name: userInfo.user_metadata?.display_name,
    role: userInfo.role || "authenticated",
  };
};

// Get current user ID from token
export const getCurrentUserId = () => {
  try {
    const token = getAuthToken();
    if (!token) return null;
    
    const userInfo = verifySupabaseToken(token);
    return userInfo.user_id;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    // Remove invalid token
    removeAuthToken();
    return null;
  }
};

// Get current user info from token
export const getCurrentUserInfo = () => {
  try {
    const token = getAuthToken();
    if (!token) return null;
    
    const userInfo = verifySupabaseToken(token);
    return extractUserMetadata(userInfo);
  } catch (error) {
    console.error('Error getting current user info:', error);
    // Remove invalid token
    removeAuthToken();
    return null;
  }
};

// Check if token is valid and not expired
export const isTokenValid = () => {
  try {
    const token = getAuthToken();
    if (!token) return false;
    
    verifySupabaseToken(token);
    return true;
  } catch (error) {
    return false;
  }
};

// Enhanced fetch wrapper with error handling
export const authenticatedFetch = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...createAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  // Handle authentication errors
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    // Optional: redirect to login page
    // window.location.href = '/login';
    throw new Error('Authentication required. Please log in again.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response;
};

// Helper function for FormData requests (file uploads)
export const authenticatedFetchFormData = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      // Don't set Content-Type for FormData - let browser set it
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    throw new Error('Authentication required. Please log in again.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response;
};

// Token management utilities
export const setAuthToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("access_token");
};

export const isAuthenticated = () => {
  return !!getAuthToken() && isTokenValid();
};