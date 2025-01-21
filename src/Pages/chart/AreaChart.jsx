import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AreaChart = ({ Chart_data }) => {
  // Detect mobile screen
  const isMobile = window.innerWidth < 768;
  
  // Set font size, height, and margins based on screen size
  const fontSize = isMobile ? 10 : 12;
  const chartHeight = isMobile ? 150 : 300;
  const margin = isMobile
    ? { top: 10, right: 20, left: 10, bottom: 10 }
    : { top: 10, right: 30, left: 20, bottom: 10 };

  return (
    <div style={{ width: "100%", height: `${chartHeight}px` }}>
      <ResponsiveContainer>
        <RechartsAreaChart
          data={Chart_data}
          margin={margin}
        >
          <defs>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isMobile ? "#e8e8e8" : "#ccc"}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize, fill: "#666" }}
            tickMargin={8}
            stroke="#888"
            padding={{ left: 15, right: 15 }}
          />
          <YAxis
            tick={{ fontSize, fill: "#666" }}
            stroke="#888"
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              fontSize: fontSize + 2,
            }}
            labelStyle={{ color: "#127afb", fontWeight: "bold" }}
            itemStyle={{ color: "#333" }}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#4CAF50"
            fillOpacity={1}
            fill="url(#colorExpense)"
            strokeWidth={2}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
