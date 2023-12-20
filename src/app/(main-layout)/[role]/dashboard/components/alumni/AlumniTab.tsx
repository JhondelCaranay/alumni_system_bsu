"use client";

import { useState } from "react";
import AlumniChart from "./AlumniChart";
import AlumniSummary from "./AlumniSummary";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getDashboardAlumni } from "@/queries/dashboard";

const yearSpan = [
  {
    value: 5,
    label: "5 Years",
  },
  {
    value: 10,
    label: "10 Years",
  },
  {
    value: 15,
    label: "15 Years",
  },
  {
    value: 20,
    label: "20 Years",
  },
  {
    value: 25,
    label: "25 Years",
  },
];

const AlumniTab = () => {
  const [year, setYear] = useState<number>(yearSpan[1].value);

  const dashboardAlumniQuery = useQuery({
    queryKey: [
      "dashboard-alumni-total",
      {
        yearSpan: year,
      },
    ],
    queryFn: () => getDashboardAlumni(year),
  });

  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 md:col-span-3 flex flex-col gap-5">
        <div className="shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <div className="flex flex-wrap items-center gap-5 md:gap-10 h-full">
            <Select
              onValueChange={(e) => setYear(parseInt(e))}
              defaultValue={year.toString()}
            >
              <SelectTrigger className="w-[300px] h-[50px]">
                <SelectValue placeholder="Select Years" />
              </SelectTrigger>
              <SelectContent>
                {yearSpan.map((year) => (
                  <SelectItem value={year.value.toString()} key={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-[550px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <h2 className="text-center font-bold text-xl">GRAPH</h2>
          <AlumniChart data={dashboardAlumniQuery.data || []} />
        </div>
      </div>
      <div className="col-span-5 md:col-span-2 h-full max-h-[660px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl sticky top-0">SUMMARY</h2>
        <div className="overflow-y-auto h-[90%] mt-2">
          <AlumniSummary data={dashboardAlumniQuery.data || []} />
        </div>
      </div>
    </div>
  );
};
export default AlumniTab;
