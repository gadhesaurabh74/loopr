import React from 'react';
import { Search, Filter, Download, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  onExportCSV: () => void;
  onReset: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  date,
  onDateChange,
  onExportCSV,
  onReset
}) => {
  return (
    <div className="bg-indigo-950/60 backdrop-blur-sm border border-purple-700 rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-pink-400" />}
        />

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full bg-purple-900 border border-purple-600 rounded-lg px-4 py-2 text-cyan-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="w-full bg-purple-900 border border-purple-600 rounded-lg px-4 py-2 text-cyan-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4 text-fuchsia-400" />}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          leftIcon={<Filter className="w-4 h-4 text-rose-400" />}
          className="border border-rose-600 text-rose-400 hover:bg-rose-900/30"
        >
          Reset Filters
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onExportCSV}
          leftIcon={<Download className="w-4 h-4 text-cyan-400" />}
          className="bg-cyan-900 text-cyan-300 hover:bg-cyan-800"
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
