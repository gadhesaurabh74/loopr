import React from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionTableProps {
  transactions: Transaction[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  sortBy,
  sortOrder,
  onSort
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-purple-900/30 text-purple-300 border-purple-700/40';
      case 'pending':
        return 'bg-pink-900/30 text-pink-300 border-pink-700/40';
      case 'failed':
        return 'bg-red-900/30 text-red-300 border-red-700/40';
      default:
        return 'bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-700/30';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-emerald-400' : 'text-rose-400';
    return <span className={color}>{prefix}${Math.abs(amount).toLocaleString()}</span>;
  };

  const SortButton: React.FC<{ field: string; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-left hover:text-pink-400 text-purple-300 transition-colors"
    >
      <span>{children}</span>
      <ArrowUpDown className="w-4 h-4" />
    </button>
  );

  if (transactions.length === 0) {
    return (
      <div className="bg-indigo-950/70 backdrop-blur-sm border border-purple-800 rounded-xl p-8 text-center">
        <p className="text-pink-300">No transactions found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-fuchsia-950/60 backdrop-blur-sm border border-fuchsia-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-900/50">
            <tr className="border-b border-fuchsia-800">
              <th className="px-6 py-4 text-left text-sm font-medium text-pink-300">
                <SortButton field="name">Transaction</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-pink-300">
                <SortButton field="date">Date</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-pink-300">
                <SortButton field="amount">Amount</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-pink-300">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-pink-300">
                Category
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-pink-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-800">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-indigo-900/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_items_boosted&w=740'}
                      alt={transaction.user.name}
                      className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform duration-200"
                    />
                    <div>
                      <p className="text-cyan-300 font-medium">{transaction.name}</p>
                      <p className="text-fuchsia-300 text-sm">{transaction.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-purple-300">{transaction.date}</td>
                <td className="px-6 py-4 font-semibold">
                  {formatAmount(transaction.amount, transaction.type)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-pink-300">{transaction.category}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-fuchsia-400 hover:text-pink-300 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
