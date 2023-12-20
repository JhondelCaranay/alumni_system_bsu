import useWindowSize from "@/hooks/useWindowSize";
import { DashboardAlumniTotalType } from "@/queries/dashboard";
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

type AlumniChartProps = {
  data: DashboardAlumniTotalType[];
};

export default function AlumniChart({ data }: AlumniChartProps) {
  // 768px
  const windowSize = useWindowSize();
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
        {windowSize.width > 768 ? <YAxis /> : null}
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
