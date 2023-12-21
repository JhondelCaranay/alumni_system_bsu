import useWindowSize from "@/hooks/useWindowSize";
import { DashboardJobsPerYearType } from "@/queries/dashboard";
import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Legend,
  Bar,
} from "recharts";

type JobChartProps = {
  data: DashboardJobsPerYearType[];
};

export default function JobChart({ data }: JobChartProps) {
  const windowSize = useWindowSize();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        {windowSize.width > 768 ? <YAxis /> : null}
        <Tooltip />
        <Legend />
        <Bar
          dataKey="studentsWithJob"
          name="Students with job"
          stackId="a"
          fill="#3498db"
        />
        <Bar
          dataKey="alumniWithJob"
          name="Alumni with job"
          stackId="a"
          fill="#2ecc71"
          className="bg-red-500"
        />
        {/* Green shade */}
      </BarChart>
    </ResponsiveContainer>
  );
}
// export default function JobChart() {
//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <AreaChart
//         width={500}
//         height={400}
//         data={data}
//         margin={{
//           top: 10,
//           right: 30,
//           left: 0,
//           bottom: 0,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="year" />
//         <YAxis />
//         <Tooltip />
//         <Area
//           type="monotone"
//           dataKey="graduates"
//           stackId="1"
//           stroke="#8884d8"
//           fill="#8884d8"
//         />
//         {/* <Area
//           type="monotone"
//           dataKey="pv"
//           stackId="1"
//           stroke="#82ca9d"
//           fill="#82ca9d"
//         />
//         <Area
//           type="monotone"
//           dataKey="amt"
//           stackId="1"
//           stroke="#ffc658"
//           fill="#ffc658"
//         /> */}
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// }
