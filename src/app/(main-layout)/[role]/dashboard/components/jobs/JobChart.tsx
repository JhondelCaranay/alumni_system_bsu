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

const data = [
  {
    id: 1,
    year: 2023,
    studentsWithJobs: 4000,
    AlumniWithJobs: 4000,
  },
  {
    id: 2,
    year: 2022,
    studentsWithJobs: 3000,
    AlumniWithJobs: 3000,
  },
  {
    id: 3,
    year: 2021,
    studentsWithJobs: 2000,
    AlumniWithJobs: 2000,
  },
  {
    id: 4,
    year: 2020,
    studentsWithJobs: 2780,
    AlumniWithJobs: 2780,
  },
  {
    id: 5,
    year: 2019,
    studentsWithJobs: 1890,
    AlumniWithJobs: 1890,
  },
  {
    id: 6,
    year: 2018,
    studentsWithJobs: 2390,
    AlumniWithJobs: 2390,
  },
  {
    id: 7,
    year: 2017,
    studentsWithJobs: 3490,
    AlumniWithJobs: 3490,
  },
  {
    id: 8,
    year: 2016,
    studentsWithJobs: 4000,
    AlumniWithJobs: 4000,
  },
  {
    id: 9,
    year: 2015,
    studentsWithJobs: 3000,
    AlumniWithJobs: 3000,
  },
];
export default function JobChart() {
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
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="studentsWithJobs"
          name="Students with job"
          stackId="a"
          fill="#3498db"
        />
        <Bar
          dataKey="AlumniWithJobs"
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
