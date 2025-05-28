
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'customer';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Demo users database
const demoUsers: { [key: string]: User } = {
  'admin@cigo.io': {
    id: '1',
    email: 'admin@cigo.io',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  'dispatcher@cigo.io': {
    id: '2',
    email: 'dispatcher@cigo.io',
    name: 'Sarah Johnson',
    role: 'dispatcher',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b6ad?w=32&h=32&fit=crop&crop=face'
  },
  'driver@cigo.io': {
    id: '3',
    email: 'driver@cigo.io',
    name: 'Mike Wilson',
    role: 'driver',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
  },
  'customer@cigo.io': {
    id: '4',
    email: 'customer@cigo.io',
    name: 'John Smith',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
  }
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user exists in demo database
      const demoUser = demoUsers[email.toLowerCase()];
      
      if (!demoUser || password !== 'demo123') {
        throw new Error('Invalid credentials');
      }
      
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
