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
    year: 2023,
    graduates: 4000,
  },
  {
    year: 2022,
    graduates: 3000,
  },
  {
    year: 2021,
    graduates: 2000,
  },
  {
    year: 2020,
    graduates: 2780,
  },
  {
    year: 2019,
    graduates: 1890,
  },
  {
    year: 2018,
    graduates: 2390,
  },
  {
    year: 2017,
    graduates: 3490,
  },
  {
    year: 2016,
    graduates: 4000,
  },
];

export default function AlumniChart() {
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
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="graduates"
          stackId="1"
          stroke="#007bff"
          fill="#007bff"
        />
        {/* <Area
          type="monotone"
          dataKey="pv"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
        <Area
          type="monotone"
          dataKey="amt"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
        /> */}
      </AreaChart>
    </ResponsiveContainer>
  );
}
