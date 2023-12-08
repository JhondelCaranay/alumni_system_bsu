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
    total: 2400,
  },
  {
    name: "Second Year",
    male: 3000,
    female: 1398,
    total: 2210,
  },
  {
    name: "Third Year",
    male: 2000,
    female: 9800,
    total: 2290,
  },
  {
    name: "Fourth Year",
    male: 2780,
    female: 3908,
    total: 2000,
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
          fill="#4caf50"
        />
        <Area
          type="monotone"
          dataKey="male"
          stackId="1"
          stroke="#007bff" // Blue color for male
          fill="#007bff"
        />
        <Area
          type="monotone"
          dataKey="female"
          stackId="1"
          stroke="#ff69b4" // Pink color for female
          fill="#ff69b4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
