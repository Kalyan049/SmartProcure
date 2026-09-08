import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LanguageCode } from '@shared/types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  language: LanguageCode;
  isAuthenticated: boolean;
  loginAs: (role: UserRole, name?: string) => void;
  logout: () => void;
  setLanguage: (lang: LanguageCode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('smartprocure_role') as UserRole) || 'FARMER';
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('smartprocure_lang') as LanguageCode) || 'en';
  });

  const [user, setUser] = useState<User | null>(() => {
    return {
      id: role === 'OFFICER' ? 'usr-officer-01' : 'usr-farmer-01',
      name: role === 'OFFICER' ? 'Procurement Officer' : 'Ramesh Kumar',
      mobile: role === 'OFFICER' ? '9999999999' : '9876543210',
      role: role,
      language: language,
      created_at: new Date().toISOString(),
    };
  });

  useEffect(() => {
    localStorage.setItem('smartprocure_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('smartprocure_lang', language);
  }, [language]);

  const loginAs = (newRole: UserRole, name?: string) => {
    setRole(newRole);
    setUser({
      id: newRole === 'OFFICER' ? 'usr-officer-01' : 'usr-farmer-01',
      name: name || (newRole === 'OFFICER' ? 'Procurement Officer' : 'Ramesh Kumar'),
      mobile: newRole === 'OFFICER' ? '9999999999' : '9876543210',
      role: newRole,
      language,
      created_at: new Date().toISOString(),
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartprocure_token');
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (user) {
      setUser({ ...user, language: lang });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        language,
        isAuthenticated: !!user,
        loginAs,
        logout,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
