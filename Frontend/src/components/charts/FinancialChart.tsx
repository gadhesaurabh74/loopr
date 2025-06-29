import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface FinancialChartProps {
  data: MonthlyData[];
  height?: number;
}

const processQuarterlyData = (monthlyData: MonthlyData[]) => {
  const quarterlyData: Record<string, { income: number; expenses: number; months: string[] }> = {};
  
  monthlyData.forEach(item => {
    const [year, month] = item.month.split('-');
    const monthNum = parseInt(month);
    const quarter = Math.ceil(monthNum / 3);
    const quarterKey = `${year}-Q${quarter}`;
    
    if (!quarterlyData[quarterKey]) {
      quarterlyData[quarterKey] = { income: 0, expenses: 0, months: [] };
    }
    
    quarterlyData[quarterKey].income += item.income;
    quarterlyData[quarterKey].expenses += item.expenses;
    quarterlyData[quarterKey].months.push(item.month);
  });

  return Object.entries(quarterlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-4)
    .map(([quarter, data]) => ({
      month: quarter,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }));
};

const processYearlyData = (monthlyData: MonthlyData[]) => {
  const yearlyData: Record<string, { income: number; expenses: number }> = {};
  
  monthlyData.forEach(item => {
    const year = item.month.split('-')[0];
    
    if (!yearlyData[year]) {
      yearlyData[year] = { income: 0, expenses: 0 };
    }
    
    yearlyData[year].income += item.income;
    yearlyData[year].expenses += item.expenses;
  });

  return Object.entries(yearlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-3)
    .map(([year, data]) => ({
      month: year,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }));
};

const FinancialChart: React.FC<FinancialChartProps> = ({ data, height = 300 }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; income: number; expenses: number } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    switch (selectedPeriod) {
      case 'Quarterly':
        return processQuarterlyData(data);
      case 'Yearly':
        return processYearlyData(data);
      default:
        return data.slice(-12);
    }
  }, [data, selectedPeriod]);

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[#fcd34d]">
        No data available for {selectedPeriod.toLowerCase()} view
      </div>
    );
  }

  const maxIncome = Math.max(...processedData.map(d => d.income));
  const maxExpenses = Math.max(...processedData.map(d => d.expenses));
  const maxValue = Math.max(maxIncome, maxExpenses);
  const range = maxValue;

  const padding = { top: 40, right: 40, bottom: 60, left: 80 };
  const chartWidth = 800;
  const chartHeight = height - padding.top - padding.bottom;

  const incomePoints = processedData.map((point, index) => {
    const x = (index / (processedData.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left;
    const y = padding.top + ((maxValue - point.income) / range) * chartHeight;
    return { x, y, value: point.income, month: point.month };
  });

  const expensePoints = processedData.map((point, index) => {
    const x = (index / (processedData.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left;
    const y = padding.top + ((maxValue - point.expenses) / range) * chartHeight;
    return { x, y, value: point.expenses, month: point.month };
  });

  const incomePathD = incomePoints.map((point, index) =>
    index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
  ).join(' ');

  const expensePathD = expensePoints.map((point, index) =>
    index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
  ).join(' ');

  const incomeAreaD = `${incomePathD} L ${incomePoints[incomePoints.length - 1].x} ${padding.top + chartHeight} L ${incomePoints[0].x} ${padding.top + chartHeight} Z`;

  const yAxisLabels = [];
  for (let i = 0; i <= 5; i++) {
    const value = (maxValue / 5) * i;
    const y = padding.top + chartHeight - (i / 5) * chartHeight;
    yAxisLabels.push({ value, y });
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
  };

  const formatLabel = (monthStr: string) => {
    if (selectedPeriod === 'Yearly' || selectedPeriod === 'Quarterly') return monthStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(monthStr.split('-')[1]) - 1;
    return months[monthIndex] || monthStr;
  };

  const getTooltipTitle = (monthStr: string) => {
    if (selectedPeriod === 'Yearly') return `Year ${monthStr}`;
    if (selectedPeriod === 'Quarterly') return monthStr.replace('-', ' ');
    const [year, month] = monthStr.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = parseInt(month) - 1;
    return `${months[monthIndex]} ${year}`;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#6366f1] rounded-full"></div>
              <span className="text-sm text-[#a5f3fc]">Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#ec4899] rounded-full"></div>
              <span className="text-sm text-[#a5f3fc]">Expenses</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10">
              {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowDropdown(false);
                    setHoveredPoint(null);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${selectedPeriod === period ? 'text-[#6366f1] bg-gray-700' : 'text-white'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative bg-gray-900/50 rounded-xl p-4">
        <svg width={chartWidth} height={height} className="w-full h-full" viewBox={`0 0 ${chartWidth} ${height}`}>
          <defs>
            <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="opacity-20">
            {yAxisLabels.map((label, i) => (
              <line key={i} x1={padding.left} y1={label.y} x2={chartWidth - padding.right} y2={label.y} stroke="#374151" strokeWidth="1" strokeDasharray="2,2" />
            ))}
            {processedData.map((_, index) => {
              const x = (index / (processedData.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left;
              return <line key={index} x1={x} y1={padding.top} x2={x} y2={padding.top + chartHeight} stroke="#374151" strokeWidth="1" strokeDasharray="2,2" />;
            })}
          </g>

          {yAxisLabels.map((label, i) => (
            <text key={i} x={padding.left - 10} y={label.y + 4} textAnchor="end" className="fill-[#a5f3fc] text-sm">
              {formatCurrency(label.value)}
            </text>
          ))}

          <path d={incomeAreaD} fill="url(#incomeGradient)" />
          <path d={incomePathD} fill="none" stroke="#6366f1" strokeWidth="3" filter="url(#glow)" />
          <path d={expensePathD} fill="none" stroke="#ec4899" strokeWidth="3" filter="url(#glow)" />

          {incomePoints.map((point, index) => (
            <circle
              key={`income-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#6366f1"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredPoint({ month: point.month, income: point.value, expenses: expensePoints[index].value })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
          {expensePoints.map((point, index) => (
            <circle
              key={`expense-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#ec4899"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredPoint({ month: point.month, income: incomePoints[index].value, expenses: point.value })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
          {processedData.map((item, index) => {
            const x = (index / (processedData.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left;
            return (
              <text key={index} x={x} y={padding.top + chartHeight + 20} textAnchor="middle" className="fill-[#a5f3fc] text-sm">
                {formatLabel(item.month)}
              </text>
            );
          })}

          {hoveredPoint && (
            <g>
              <line
                x1={incomePoints.find(p => p.month === hoveredPoint.month)?.x || 0}
                y1={padding.top}
                x2={incomePoints.find(p => p.month === hoveredPoint.month)?.x || 0}
                y2={padding.top + chartHeight}
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <foreignObject x={(incomePoints.find(p => p.month === hoveredPoint.month)?.x || 0) - 70} y={padding.top - 90} width="140" height="80">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
                  <div className="text-xs text-[#a5f3fc] mb-2 font-medium">{getTooltipTitle(hoveredPoint.month)}</div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center justify-between text-[#6366f1]">
                      <span>Income</span>
                      <span className="font-semibold">{formatCurrency(hoveredPoint.income)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#ec4899]">
                      <span>Expenses</span>
                      <span className="font-semibold">{formatCurrency(hoveredPoint.expenses)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#a5f3fc] border-t border-gray-600 pt-1">
                      <span>Net</span>
                      <span className={`font-semibold ${hoveredPoint.income - hoveredPoint.expenses >= 0 ? 'text-[#6366f1]' : 'text-[#ef4444]'}`}>
                        {formatCurrency(hoveredPoint.income - hoveredPoint.expenses)}
                      </span>
                    </div>
                  </div>
                </div>
              </foreignObject>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="text-sm text-[#fcd34d]">Total Income</div>
          <div className="text-lg font-semibold text-[#6366f1]">
            {formatCurrency(processedData.reduce((sum, item) => sum + item.income, 0))}
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="text-sm text-[#fcd34d]">Total Expenses</div>
          <div className="text-lg font-semibold text-[#ec4899]">
            {formatCurrency(processedData.reduce((sum, item) => sum + item.expenses, 0))}
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="text-sm text-[#fcd34d]">Net Profit</div>
          <div className={`text-lg font-semibold ${processedData.reduce((sum, item) => sum + item.net, 0) >= 0 ? 'text-[#6366f1]' : 'text-[#ef4444]'}`}>
            {formatCurrency(processedData.reduce((sum, item) => sum + item.net, 0))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
