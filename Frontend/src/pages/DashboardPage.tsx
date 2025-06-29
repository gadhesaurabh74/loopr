import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import FinancialChart from '../components/charts/FinancialChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { Transaction, DashboardStats } from '../types';
import { transformTransactionData, calculateDashboardStats, generateMonthlyFinancialData } from '../utils/dataTransformer';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalTransactions: 0
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const transactions = transformTransactionData();
    const dashboardStats = calculateDashboardStats(transactions);
    const monthlyFinancialData = generateMonthlyFinancialData(transactions);

    const sortedTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    setStats(dashboardStats);
    setRecentTransactions(sortedTransactions);
    setMonthlyData(monthlyFinancialData);
  }, []);

  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };

  const getChangePercentage = (current: number, type: 'balance' | 'income' | 'expenses' | 'transactions') => {
    const mockPreviousValues = {
      balance: current * 0.89,
      income: current * 0.92,
      expenses: current * 1.03,
      transactions: Math.floor(current * 0.85)
    };
    const previous = mockPreviousValues[type];
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const getChangeType = (current: number, type: 'balance' | 'income' | 'expenses' | 'transactions'): 'positive' | 'negative' | 'neutral' => {
    const mockPreviousValues = {
      balance: current * 0.89,
      income: current * 0.92,
      expenses: current * 1.03,
      transactions: Math.floor(current * 0.85)
    };
    const previous = mockPreviousValues[type];
    const change = current - previous;

    if (type === 'expenses') {
      return change < 0 ? 'positive' : 'negative';
    }
    return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your financial overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Balance"
            value={`$${stats.totalBalance.toLocaleString()}`}
            change={`${getChangePercentage(stats.totalBalance, 'balance')} from last month`}
            changeType={getChangeType(stats.totalBalance, 'balance')}
            icon={DollarSign}
            color="bg-[#2C2E81]/20 text-[#A5B4FC]"
          />
          <StatsCard
            title="Total Income"
            value={`$${stats.totalIncome.toLocaleString()}`}
            change={`${getChangePercentage(stats.totalIncome, 'income')} from last month`}
            changeType={getChangeType(stats.totalIncome, 'income')}
            icon={TrendingUp}
            color="bg-[#14532D]/20 text-[#BBF7D0]"
          />
          <StatsCard
            title="Total Expenses"
            value={`$${stats.totalExpenses.toLocaleString()}`}
            change={`${getChangePercentage(stats.totalExpenses, 'expenses')} from last month`}
            changeType={getChangeType(stats.totalExpenses, 'expenses')}
            icon={TrendingDown}
            color="bg-[#581C87]/20 text-[#E9D5FF]"
          />
          <StatsCard
            title="Transactions"
            value={stats.totalTransactions.toString()}
            change={`${getChangePercentage(stats.totalTransactions, 'transactions')} from last month`}
            changeType={getChangeType(stats.totalTransactions, 'transactions')}
            icon={CreditCard}
            color="bg-[#1E3A8A]/20 text-[#BFDBFE]"
          />
        </div>

        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <FinancialChart data={monthlyData} height={400} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <RecentTransactions
            transactions={recentTransactions}
            onViewAll={handleViewAllTransactions}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
