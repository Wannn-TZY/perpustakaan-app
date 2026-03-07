// context/AuthContext.js

import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../services/api';

export const AuthContext = createContext();

const STORAGE_USER = '@bacabuku:user';
const STORAGE_TOKEN = '@bacabuku:token';

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [booting, setBooting] = useState(true);

  // ── Restore Session ─────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(STORAGE_USER);
        const savedToken = await AsyncStorage.getItem(STORAGE_TOKEN);

        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);

          setUserState(parsedUser);
          setTokenState(savedToken);
          setAuthToken(savedToken);
        }
      } catch (e) {
        await AsyncStorage.multiRemove([STORAGE_USER, STORAGE_TOKEN]);
      } finally {
        setBooting(false);
      }
    };

    restoreSession();
  }, []);

  // ── Set User After Login/Register ───────────────
  const setUser = async (data) => {
    try {
      if (!data?.token) {
        console.warn('Token tidak ada dari backend');
        return;
      }

      const { token: newToken, ...userOnly } = data;

      setUserState(userOnly);
      setTokenState(newToken);
      setAuthToken(newToken);

      await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(userOnly));
      await AsyncStorage.setItem(STORAGE_TOKEN, newToken);
    } catch (err) {
      console.error('SetUser error:', err);
    }
  };

  // ── Update Existing User Info (Reactivity) ──────
  const updateUser = async (partialData) => {
    try {
      const updatedUser = { ...user, ...partialData };
      setUserState(updatedUser);
      await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(updatedUser));
    } catch (err) {
      console.error('UpdateUser error:', err);
    }
  };

  // ── Logout ──────────────────────────────────────
  const logout = async () => {
    try {
      await api.post('/auth/logout').catch(() => { });
    } finally {
      setAuthToken(null);
      setUserState(null);
      setTokenState(null);
      await AsyncStorage.multiRemove([STORAGE_USER, STORAGE_TOKEN]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        booting,
        setUser,
        updateUser,
        logout,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff' || user?.role === 'admin',
        isMember:
          user?.role === 'member' ||
          user?.role === 'staff' ||
          user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}