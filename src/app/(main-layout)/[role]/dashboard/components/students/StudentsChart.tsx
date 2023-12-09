import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "First Year",
    male: 4000,
    female: 2400,
    total: 6400,
  },
  {
    name: "Second Year",
    male: 3000,
    female: 1398,
    total: 4398,
  },
  {
    name: "Third Year",
    male: 2000,
    female: 9800,
    total: 11800,
  },
  {
    name: "Fourth Year",
    male: 2780,
    female: 3908,
    total: 6688,
  },
];

export default function StudentChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="StudentsColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="MalesColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#007bff" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="FemalesColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff69b4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ff69b4" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="total"
          name="All Students"
          stackId="1"
          stroke="#4caf50"
          fillOpacity={1}
          fill="url(#StudentsColor)"
        />
        <Area
          type="monotone"
          dataKey="male"
          stackId="1"
          stroke="#007bff" // Blue color for male
          fillOpacity={1}
          fill="url(#MalesColor)"
        />
        <Area
          type="monotone"
          dataKey="female"
          stackId="1"
          stroke="#ff69b4" // Pink color for female
          fillOpacity={1}
          fill="url(#FemalesColor)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
