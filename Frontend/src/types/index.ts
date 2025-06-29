export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'income' | 'expense';
  category: string;
  description?: string;
  user: User;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalTransactions: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}