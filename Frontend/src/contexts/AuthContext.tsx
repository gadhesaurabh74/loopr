import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username: email, // backend expects username
        password,
      });

      const token = res.data.token;
      const decoded: any = JSON.parse(atob(token.split('.')[1]));

      const loggedInUser: User = {
        id: decoded.userId,
        name: email.split('@')[0],
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      };

      setUser(loggedInUser);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return true;
    } catch (error: any) {
      console.error('%c[Login Error]', 'color: #ff4c4c;', error);
      // Optionally: showToast("Login failed", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username: name,
        email,
        password,
      });

      const token = res.data.token;
      const decoded: any = JSON.parse(atob(token.split('.')[1]));

      const newUser: User = {
        id: decoded.userId,
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      };

      setUser(newUser);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return true;
    } catch (error: any) {
      console.error('%c[Signup Error]', 'color: #ff4c4c;', error);
      // Optionally: showToast("Signup failed", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    // Optionally: showToast("Logged out successfully", "info");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
