"use client";

import React, { PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
  LineChart,
} from "recharts";

import { BarChart, Rectangle } from "recharts";

const data = [
  {
    name: "1st Year",
    Male: 590,
    Female: 800,
    total: 1228,
  },
  {
    name: "2nd Year",
    Male: 868,
    Female: 967,
    total: 1228,
  },
  {
    name: "3rd Year",
    Male: 1397,
    Female: 1098,
   total: 1228,
  },
  {
    name: "4th Year",
    Male: 1480,
    Female: 1200,
    total: 1228,
  },
];

class CustomizedLabel extends PureComponent {
  render() {
    const { x, y, stroke, value } = this.props as any;

    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  }
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props as any;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
        className="text-sm"
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-35)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}

export default function StudentsChart() {
  return (
    <div className="grid grid-rows-3 grid-cols-3 gap-y-10">
      <div className="flex flex-col">
        <h1 className="text-center text-zinc-600 text-[1.5em]">Computer</h1>
        <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ right: 25, top: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Male" stroke="#8884d8" label={<CustomizedLabel />} />
          <Line type="monotone" dataKey="Female" stroke="#82ca9d" label={<CustomizedLabel />}/>
          <Line type="monotone" dataKey="total" className="hidden"/>
        </LineChart>
      </ResponsiveContainer>
      </div>
      <div className="flex flex-col">
        <h1 className="text-center text-zinc-600 text-[1.5em]">Automotive</h1>
        <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ right: 25, top: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Male" stroke="#8884d8" label={<CustomizedLabel />} />
          <Line type="monotone" dataKey="Female" stroke="#82ca9d" label={<CustomizedLabel />}/>
          <Line type="monotone" dataKey="total" className="hidden"/>
        </LineChart>
      </ResponsiveContainer>
      </div>
      <div className="flex flex-col">
        <h1 className="text-center text-zinc-600 text-[1.5em]">Food</h1>
        <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ right: 25, top: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Male" stroke="#8884d8" label={<CustomizedLabel />} />
          <Line type="monotone" dataKey="Female" stroke="#82ca9d" label={<CustomizedLabel />}/>
          <Line type="monotone" dataKey="total" className="hidden"/>
        </LineChart>
      </ResponsiveContainer>
      </div>
      <div className="flex flex-col">
        <h1 className="text-center text-zinc-600 text-[1.5em]">Drafting</h1>
        <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ right: 25, top: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Male" stroke="#8884d8" label={<CustomizedLabel />} />
          <Line type="monotone" dataKey="Female" stroke="#82ca9d" label={<CustomizedLabel />}/>
          <Line type="monotone" dataKey="total" className="hidden"/>
        </LineChart>
      </ResponsiveContainer>
      </div>
      <div className="flex flex-col">
        <h1 className="text-center text-zinc-600 text-[1.5em]">Mechanical</h1>
        <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ right: 25, top: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Male" stroke="#8884d8" label={<CustomizedLabel />} />
          <Line type="monotone" dataKey="Female" stroke="#82ca9d" label={<CustomizedLabel />}/>
          <Line type="monotone" dataKey="total" className="hidden"/>
        </LineChart>
      </ResponsiveContainer>
      </div>

      <div className="flex flex-col">
        <h1 className="text-center text-zinc-600 text-[1.5em]">EEC</h1>
        <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ right: 25, top: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Male" stroke="#8884d8" label={<CustomizedLabel />} />
          <Line type="monotone" dataKey="Female" stroke="#82ca9d" label={<CustomizedLabel />}/>
          <Line type="monotone" dataKey="total" className="hidden"/>
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
