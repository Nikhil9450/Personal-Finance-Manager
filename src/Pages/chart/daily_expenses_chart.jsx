import React, { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Daily_expenses_chart = () => {
    const data = [
  {
    name: "A",
    uv: 4000,
    pv: 500,
    amt: 2400,
  },
  {
    name: "B",
    uv: 3000,
    pv: 50,
    amt: 2210,
  },
  {
    name: "C",
    uv: 2000,
    pv: 300,
    amt: 2290,
  },
  {
    name: "D",
    uv: 2780,
    pv: 90,
    amt: 2000,
  },
  {
    name: "E",
    uv: 1890,
    pv: 10,
    amt: 2181,
  },
  {
    name: "F",
    uv: 2390,
    pv: 200,
    amt: 2500,
  },
  {
    name: "G",
    uv: 3490,
    pv: 150,
    amt: 2100,
  },
];
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        {/* <Line type="monotone" dataKey="amt" stroke="#32ca9d" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};


export default Daily_expenses_chart;
