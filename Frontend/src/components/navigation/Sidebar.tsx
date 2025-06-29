import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3,
  CreditCard,
  PieChart,
  Settings,
  User,
  LogOut,
  Home,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Transactions', path: '/transactions' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-zinc-900/95 backdrop-blur-md border-r border-zinc-800 z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <BarChart3 className="w-8 h-8 text-cyan-400 mr-2" />
            FinanceApp
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-violet-700/30'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_items_boosted&w=740'}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-rose-400 text-sm">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-rose-300 hover:text-white hover:bg-rose-600/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
