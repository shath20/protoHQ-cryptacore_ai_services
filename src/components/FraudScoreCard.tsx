import React from 'react';

interface FraudScoreCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  color: 'blue' | 'red' | 'purple' | 'green';
}

export function FraudScoreCard({ title, value, icon, trend, color }: FraudScoreCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  };

  const bgClasses = {
    blue: 'bg-blue-50 border-blue-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200'
  };

  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600';

  return (
    <div className={`relative group overflow-hidden rounded-xl border-2 ${bgClasses[color]} bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900 tabular-nums">
                {value.toLocaleString()}
              </span>
              <div className={`flex items-center text-sm font-medium ${trendColor}`}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
                <span className="ml-1">{Math.abs(trend)}%</span>
              </div>
            </div>
          </div>
          
          <div className={`relative p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <div className="absolute inset-0 bg-white opacity-20 rounded-xl animate-pulse"></div>
            <div className="relative text-white">
              {icon}
            </div>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
            style={{ 
              width: `${Math.min((value / 100) * 100, 100)}%`,
              animation: 'slideIn 1s ease-out'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}