import React, { useMemo, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

/**
 * Hook: measure container width in real CSS pixels so we can draw
 * the SVG 1:1 and keep text size constant across breakpoints.
 */
function useContainerWidth(minWidth = 320, initial = 800) {
  const ref = useRef(null);
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? el.clientWidth ?? initial;
      setWidth(Math.max(minWidth, Math.round(w)));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [minWidth, initial]);

  return [ref, width];
}

const ChartDashboard = ({ transactions, categories, selectedMonth }) => {
  // Filter transactions for selected month and previous months for trends
  const currentMonthTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(selectedMonth)),
    [transactions, selectedMonth]
  );

  // Generate monthly data for trend analysis (last 6 months)
  const monthlyData = useMemo(() => {
    const months = [];
    const currentDate = new Date(selectedMonth + "-01");

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(monthDate.getMonth() - i);

      // Timezone-safe YYYY-MM
      const monthKey = `${monthDate.getFullYear()}-${String(
        monthDate.getMonth() + 1
      ).padStart(2, "0")}`;

      const monthName = monthDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const monthTransactions = transactions.filter((t) =>
        t.date.startsWith(monthKey)
      );

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: monthName,
        monthKey,
        income,
        expenses,
        balance: income - expenses,
        hasData: monthTransactions.length > 0,
      });
    }

    return months;
  }, [transactions, selectedMonth]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const categoryTotals = {};

    currentMonthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthTransactions]);

  // Colors for charts
  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f59e0b",
  ];

  const BarChart = ({ data }) => {
    // Avoid NaN/Infinity when all values are 0
    const maxValue = Math.max(
      1,
      ...data.map((d) => Math.max(d.income, d.expenses))
    );

    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{item.month}</span>
              <span
                className={`${
                  item.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                Balance: ₹{item.balance.toFixed(0)}
              </span>
            </div>
            <div className="space-y-1">
              {/* Income Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-700 w-16">Income</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${(item.income / maxValue) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-green-700 w-16 text-right">
                  ₹{item.income.toFixed(0)}
                </span>
              </div>
              {/* Expense Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-700 w-16">Expenses</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${(item.expenses / maxValue) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-red-700 w-16 text-right">
                  ₹{item.expenses.toFixed(0)}
                </span>
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

              const startX =
                centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const startY =
                centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const endX =
                centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const endY =
                centerY + radius * Math.sin((endAngle * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                "Z",
              ].join(" ");

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
              <span className="flex-1 text-sm text-gray-700">
                {item.category}
              </span>
              <span className="text-sm font-medium text-gray-800">
                ₹{item.amount.toFixed(0)} (
                {((item.amount / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LineChart = ({ data }) => {
    const [containerRef, width] = useContainerWidth(320, 800);
    const height = 240;

    if (data.length === 0) {
      return (
        <div
          ref={containerRef}
          className="flex items-center justify-center h-56 text-gray-500"
        >
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-2" />
            <p>No data available</p>
          </div>
        </div>
      );
    }

    const balances = data.map((d) => d.balance);
    const maxBalance = Math.max(...balances);
    const minBalance = Math.min(...balances);
    const range = maxBalance - minBalance;

    // Build a stable y-domain with padding
    let effectiveMax, effectiveMin;
    if (range === 0) {
      if (maxBalance === 0) {
        effectiveMax = 1000;
        effectiveMin = -1000;
      } else {
        const pad = Math.abs(maxBalance) * 0.5 || 1;
        effectiveMax = maxBalance + pad;
        effectiveMin = maxBalance - pad;
      }
    } else {
      const pad = range * 0.1;
      effectiveMax = maxBalance + pad;
      effectiveMin = minBalance - pad;
    }
    const effectiveRangeTotal = effectiveMax - effectiveMin;

    // Margins and inner chart size
    const margin = { top: 20, right: 32, bottom: 44, left: 56 };
    const innerWidth = Math.max(1, width - margin.left - margin.right);
    const innerHeight = Math.max(1, height - margin.top - margin.bottom);

    const getX = (index) =>
      data.length > 1
        ? margin.left + (index / (data.length - 1)) * innerWidth
        : margin.left + innerWidth / 2;

    const getY = (balance) =>
      margin.top +
      ((effectiveMax - balance) / effectiveRangeTotal) * innerHeight;

    const yGridValues = [0, 0.25, 0.5, 0.75, 1].map(
      (r) => effectiveMax - r * effectiveRangeTotal
    );

    return (
      <div ref={containerRef} className="relative w-full">
        <svg
          width={width}
          height={height}
          shapeRendering="crispEdges"
          className="block"
        >
          {/* Grid lines */}
          {yGridValues.map((val, idx) => {
            const y =
              margin.top + (idx / (yGridValues.length - 1)) * innerHeight;
            return (
              <line
                key={`grid-${idx}`}
                x1={margin.left}
                y1={y}
                x2={width - margin.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {/* Zero line */}
          {effectiveMin <= 0 && effectiveMax >= 0 && (
            <line
              x1={margin.left}
              y1={getY(0)}
              x2={width - margin.right}
              y2={getY(0)}
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
          )}

          {/* Trend line */}
          <polyline
            points={data.map((d, i) => `${getX(i)},${getY(d.balance)}`).join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
          />

          {/* Points + value labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.balance);
            return (
              <g key={`pt-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={d.hasData ? 6 : 4}
                  fill={
                    d.hasData ? (d.balance >= 0 ? "#22c55e" : "#ef4444") : "#d1d5db"
                  }
                  stroke="white"
                  strokeWidth="2"
                  opacity={d.hasData ? 1 : 0.6}
                />
                {d.hasData && (
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fontSize="10"
                    className="fill-gray-700"
                  >
                    ₹{d.balance.toFixed(0)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Y-axis labels */}
          {[
            effectiveMax,
            effectiveMax * 0.75 + effectiveMin * 0.25,
            effectiveMax * 0.5 + effectiveMin * 0.5,
            effectiveMax * 0.25 + effectiveMin * 0.75,
            effectiveMin,
          ].map((value, index) => {
            const y = margin.top + (index * innerHeight) / 4;
            return (
              <text
                key={`ylab-${index}`}
                x={margin.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                className="fill-gray-600"
              >
                ₹{Math.round(value)}
              </text>
            );
          })}

          {/* X-axis labels (months + values) aligned with points */}
          {data.map((d, i) => {
            const x = getX(i);
            return (
              <g key={`xlab-${i}`}>
                <text
                  x={x}
                  y={height - margin.bottom + 14}
                  textAnchor="middle"
                  fontSize="10"
                  className="fill-gray-700"
                >
                  {d.month}
                </text>
                <text
                  x={x}
                  y={height - margin.bottom + 28}
                  textAnchor="middle"
                  fontSize="10"
                  className={
                    d.hasData
                      ? d.balance >= 0
                        ? "fill-green-600"
                        : "fill-red-600"
                      : "fill-gray-400"
                  }
                >
                  ₹{d.balance.toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
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