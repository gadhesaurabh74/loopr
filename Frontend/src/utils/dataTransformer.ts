import transactionsData from './transactions.json';
import { Transaction, User } from '../types';

// User mapping based on user_id
const userMap: Record<string, User> = {
  'user_001': {
    id: 'user_001',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  'user_002': {
    id: 'user_002',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  'user_003': {
    id: 'user_003',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@example.com',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  'user_004': {
    id: 'user_004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
};

// Category mapping for better display names
const categoryMap: Record<string, string> = {
  'Revenue': 'Business Revenue',
  'Expense': 'Business Expense'
};

// Status mapping
const statusMap: Record<string, 'completed' | 'pending' | 'failed'> = {
  'Paid': 'completed',
  'Pending': 'pending',
  'Failed': 'failed'
};

// Generate transaction names based on category and amount
const generateTransactionName = (category: string, amount: number, type: 'income' | 'expense'): string => {
  if (type === 'income') {
    if (amount >= 3000) return 'Large Contract Payment';
    if (amount >= 2000) return 'Project Milestone';
    if (amount >= 1000) return 'Service Payment';
    return 'Consultation Fee';
  } else {
    if (amount >= 3000) return 'Major Equipment Purchase';
    if (amount >= 2000) return 'Office Lease Payment';
    if (amount >= 1000) return 'Software Licensing';
    return 'Office Supplies';
  }
};

// Generate descriptions based on transaction details
const generateDescription = (category: string, amount: number, type: 'income' | 'expense'): string => {
  if (type === 'income') {
    return `${categoryMap[category]} - Payment received for services rendered`;
  } else {
    return `${categoryMap[category]} - Business operational expense`;
  }
};

export const transformTransactionData = (): Transaction[] => {
  return transactionsData.map((item: any) => {
    const type: 'income' | 'expense' = item.category === 'Revenue' ? 'income' : 'expense';
    const user = userMap[item.user_id] || userMap['user_001'];
    const status = statusMap[item.status] || 'completed';
    
    // Format date to a more readable format
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return {
      id: item.id.toString(),
      name: generateTransactionName(item.category, item.amount, type),
      amount: item.amount,
      date: formattedDate,
      status: status,
      type: type,
      category: categoryMap[item.category] || item.category,
      description: generateDescription(item.category, item.amount, type),
      user: user
    };
  });
};

export const calculateDashboardStats = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalBalance = totalIncome - totalExpenses;
  const totalTransactions = transactions.length;

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    totalTransactions
  };
};

export const generateChartData = (transactions: Transaction[]) => {
  // Group transactions by month and calculate monthly totals
  const monthlyData: Record<string, number> = {};
  
  transactions
    .filter(t => t.status === 'completed')
    .forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey] += transaction.amount;
      } else {
        monthlyData[monthKey] -= transaction.amount;
      }
    });

  // Convert to chart format and sort by date
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([date, value]) => ({
      date,
      value: Math.max(0, value) // Ensure positive values for chart
    }));
};

// New function to generate monthly income vs expenses data
export const generateMonthlyFinancialData = (transactions: Transaction[]) => {
  const monthlyData: Record<string, { income: number; expenses: number }> = {};
  
  transactions
    .filter(t => t.status === 'completed')
    .forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

  // Convert to chart format and sort by date
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }));
};