import { useState, useEffect } from 'react';
import type { User, AuthState } from '../types';

// In a real app, these would be environment variables
const ADMIN_EMAIL = 'admin@bharatdonation.com';
const ADMIN_PASSWORD = 'admin123';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedUser = localStorage.getItem('user');
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      isLoading: false,
      error: null,
    };
  });

  useEffect(() => {
    if (authState.user) {
      localStorage.setItem('user', JSON.stringify(authState.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [authState.user]);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to your backend
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const user: User = {
          id: '1',
          email: ADMIN_EMAIL,
          isAdmin: true,
        };
        setAuthState({ user, isLoading: false, error: null });
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
      return false;
    }
  };

  const signup = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to your backend
      const user: User = {
        id: Date.now().toString(),
        email,
        isAdmin: false,
      };
      setAuthState({ user, isLoading: false, error: null });
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
      return false;
    }
  };

  const logout = () => {
    setAuthState({ user: null, isLoading: false, error: null });
  };

  return {
    ...authState,
    login,
    signup,
    logout,
  };
}