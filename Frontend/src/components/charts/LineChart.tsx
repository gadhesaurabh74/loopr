import React from 'react';
import { ChartDataPoint } from '../../types';

interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  gradientId?: string;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 200, 
  color = '#6366f1', // updated from '#10b981' (green) to vibrant indigo
  gradientId = 'lineGradient'
}) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const padding = 40;
  const width = 100;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const pathD = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const areaD = `${pathD} L ${width} ${height - padding} L 0 ${height - padding} Z`;

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <g className="opacity-20">
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={padding + (i * (height - 2 * padding) / 4)}
              x2={width}
              y2={padding + (i * (height - 2 * padding) / 4)}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Area fill below the line */}
        <path
          d={areaD}
          fill={`url(#${gradientId})`}
          className="animate-pulse"
        />

        {/* Main line path */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="animate-pulse"
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="animate-pulse hover:r-4 transition-all duration-200"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;
