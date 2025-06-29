import React from 'react';
import { LucideCrop as LucideProps } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType<LucideProps>;
  color: string; // Should be passed as Tailwind class like 'bg-cyan-600'
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color
}) => {
  const changeColors = {
    positive: 'text-lime-400',    // Neon Green
    negative: 'text-rose-400',    // Hot Red
    neutral: 'text-violet-400'    // Neon Violet
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-700 rounded-xl p-6 hover:bg-zinc-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">{title}</p>
          <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
          <p className={`text-sm mt-2 font-semibold ${changeColors[changeType]}`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-xl shadow-inner ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
