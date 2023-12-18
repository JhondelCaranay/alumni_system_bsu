"use client";

import AlumniChart from "./AlumniChart";
import AlumniSummary from "./AlumniSummary";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearRange {
  from: number;
  to: number;
}

const AlumniTab = () => {
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
  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 md:col-span-3 flex flex-col gap-5">
        <div className="shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <div className="flex flex-wrap items-center gap-5 md:gap-10 h-full">
            <Select>
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
          <AlumniChart />
        </div>
      </div>
      <div className="col-span-5 md:col-span-2 h-[670px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl sticky top-0">SUMMARY</h2>
        <div className="overflow-y-auto h-full mt-2">
          <AlumniSummary />
        </div>
      </div>
    </div>
  );
};
export default AlumniTab;
