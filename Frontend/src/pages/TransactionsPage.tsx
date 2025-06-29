import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import Alert from '../components/ui/Alert';
import { Transaction } from '../types';
import { transformTransactionData } from '../utils/dataTransformer';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [alert, setAlert] = useState({ type: 'info' as const, message: '', isVisible: false });

  useEffect(() => {
    const realTransactions = transformTransactionData();
    setTransactions(realTransactions);
  }, []);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || transaction.status === statusFilter;
      const matchesType = !typeFilter || transaction.type === typeFilter;

      const transactionDate = new Date(transaction.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      const matchesDateRange = (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate);

      return matchesSearch && matchesStatus && matchesType && matchesDateRange;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, searchTerm, statusFilter, typeFilter, dateRange, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setDateRange({ start: '', end: '' });
    setSortBy('date');
    setSortOrder('desc');
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['ID', 'Name', 'Date', 'Amount', 'Type', 'Status', 'Category', 'User', 'Description'],
      ...filteredAndSortedTransactions.map(t => [
        t.id,
        t.name,
        t.date,
        t.amount.toString(),
        t.type,
        t.status,
        t.category,
        t.user.name,
        t.description || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    setAlert({
      type: 'success',
      message: `Successfully exported ${filteredAndSortedTransactions.length} transactions to CSV!`,
      isVisible: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
      />

      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-gray-400">
            Manage and analyze all your financial transactions.
            <span className="text-indigo-400 ml-2">
              {transactions.length} total transactions loaded
            </span>
          </p>
        </div>

        <TransactionFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExportCSV={handleExportCSV}
          onReset={handleReset}
        />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-400">
            Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span>Income: {filteredAndSortedTransactions.filter(t => t.type === 'income').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span>Expenses: {filteredAndSortedTransactions.filter(t => t.type === 'expense').length}</span>
            </div>
          </div>
        </div>

        <TransactionTable
          transactions={filteredAndSortedTransactions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
