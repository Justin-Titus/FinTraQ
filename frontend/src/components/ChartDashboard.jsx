import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';

const ChartDashboard = ({ transactions, categories, selectedMonth }) => {
  // Filter transactions for selected month and previous months for trends
  const currentMonthTransactions = useMemo(() => 
    transactions.filter(t => t.date.startsWith(selectedMonth)), 
    [transactions, selectedMonth]
  );

  // Generate monthly data for trend analysis (last 6 months)
  const monthlyData = useMemo(() => {
    const months = [];
    const currentDate = new Date(selectedMonth + '-01');
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthKey = monthDate.toISOString().slice(0, 7);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
      const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: monthName,
        income,
        expenses,
        balance: income - expenses
      });
    }
    
    return months;
  }, [transactions, selectedMonth]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const categoryTotals = {};
    
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthTransactions]);

  // Colors for charts
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'
  ];

  const BarChart = ({ data }) => {
    const maxValue = Math.max(...data.flatMap(d => [d.income, d.expenses]));
    
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{item.month}</span>
              <span className={`${item.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Balance: ${item.balance.toFixed(0)}
              </span>
            </div>
            <div className="space-y-1">
              {/* Income Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-700 w-16">Income</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(item.income / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-green-700 w-16 text-right">${item.income.toFixed(0)}</span>
              </div>
              {/* Expense Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-700 w-16">Expenses</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(item.expenses / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-red-700 w-16 text-right">${item.expenses.toFixed(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const PieChartComponent = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    let currentAngle = 0;
    
    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <PieChart className="h-12 w-12 mx-auto mb-2" />
            <p>No expense data for this month</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.amount / total) * 100;
              const angle = (percentage / 100) * 360;
              const radius = 80;
              const centerX = 100;
              const centerY = 100;
              
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              currentAngle += angle;
              
              const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                'Z'
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              );
            })}
          </svg>
        </div>
        
        <div className="space-y-2 flex-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="flex-1 text-sm text-gray-700">{item.category}</span>
              <span className="text-sm font-medium text-gray-800">
                ${item.amount.toFixed(0)} ({((item.amount / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LineChart = ({ data }) => {
    const maxBalance = Math.max(...data.map(d => Math.abs(d.balance)));
    const minBalance = Math.min(...data.map(d => d.balance));
    const range = maxBalance - minBalance || 1;
    
    return (
      <div className="space-y-4">
        <div className="relative h-48">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={`${y}%`}
                x2="100%"
                y2={`${y}%`}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Zero line */}
            <line
              x1="0"
              y1={`${((maxBalance - 0) / range) * 100}%`}
              x2="100%"
              y2={`${((maxBalance - 0) / range) * 100}%`}
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            
            {/* Line chart */}
            <polyline
              points={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = ((maxBalance - item.balance) / range) * 100;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = ((maxBalance - item.balance) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill={item.balance >= 0 ? '#22c55e' : '#ef4444'}
                  className="hover:r-6 transition-all"
                />
              );
            })}
          </svg>
        </div>
        
        <div className="flex justify-between text-xs text-gray-600">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <p className="font-medium">{item.month}</p>
              <p className={`${item.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${item.balance.toFixed(0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Monthly Income vs Expenses Bar Chart */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BarChart3 className="h-5 w-5" />
            Monthly Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={monthlyData} />
        </CardContent>
      </Card>

      {/* Expense Breakdown Pie Chart */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <PieChart className="h-5 w-5" />
            Expense Breakdown by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PieChartComponent data={categoryData} />
        </CardContent>
      </Card>

      {/* Balance Trend Line Chart */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            Balance Trend Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart data={monthlyData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartDashboard;