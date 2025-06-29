import React from 'react';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, onViewAll }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30'; // neon blue
      case 'pending':
        return 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-500/30'; // neon pink
      case 'failed':
        return 'bg-orange-900/30 text-orange-400 border-orange-500/30'; // neon orange
      default:
        return 'bg-slate-900/30 text-slate-400 border-slate-500/30';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-lime-400' : 'text-sky-400'; // updated to lime & sky
    return <span className={color}>{prefix}${Math.abs(amount).toLocaleString()}</span>;
  };

  return (
    <div className="bg-zinc-900/70 backdrop-blur border border-zinc-700 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-wide">🚀 Recent Transactions</h3>
        <button
          onClick={onViewAll}
          className="text-fuchsia-400 hover:text-fuchsia-300 text-sm font-semibold uppercase tracking-wider transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/60 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <img
                src={'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_items_boosted&w=740'}
                alt={transaction.user.name}
                className="w-10 h-10 rounded-full group-hover:scale-110 transition-transform duration-200"
              />
              <div>
                <p className="text-white font-medium tracking-wide">{transaction.name}</p>
                <p className="text-slate-400 text-xs">{transaction.date}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                {transaction.status.toUpperCase()}
              </span>
              <span className="font-bold text-sm">
                {formatAmount(transaction.amount, transaction.type)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
