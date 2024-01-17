"use client";

import { useQuery } from "@tanstack/react-query";
import StudentSummary from "./StudentSummary";
import StudentChart from "./StudentsChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDeparments } from "@/queries/department";
import { useEffect, useMemo, useState } from "react";
import { getDashboardMaleFemaleStudents } from "@/queries/dashboard";
import { Loader } from "@/components/ui/loader";

const departments = [
  "AUTOMOTIVE",
  "COMPUTER",
  "DRAFTING",
  "EIR",
  "EEC",
  "FOODS",
  "MECHANICAL",
];

// Get the current year
const currentYear = new Date().getFullYear();

// Generate an array with a 16-year span starting from the current year
const years = Array.from({ length: 11 }, (_, index) =>
  (currentYear - index).toString()
);

const StudentTab = () => {
  const [departmentId, setDepartmentId] = useState<string>("");
  const [year, setYear] = useState<number>(0); //new Date().getFullYear()
  const { data: departmentData } = useQuery({
    queryKey: ["departments"],
    queryFn: getDeparments,
  });

  const { data: studentsData } = useQuery({
    queryKey: [
      "dashboard-students-total",
      {
        departmentId: departmentId,
        year: year,
      },
    ],
    queryFn: () => getDashboardMaleFemaleStudents(departmentId, year),
  });

  useEffect(() => {
    if (departmentData && departmentId === "") {
      setDepartmentId(departmentData[0].id);
    }
  }, [departmentData]);

  const getSelectedDepartmentName = useMemo(
    () =>
      departmentData?.find((department) => department.id === departmentId)
        ?.name,
    [departmentData, departmentId]
  );
  const getFullTotal = useMemo(
    () =>
      studentsData?.reduce((acc, curr) => {
        return acc + curr.total;
      }, 0),
    [studentsData]
  );

  if (!departmentData || !studentsData) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <div className="flex items-center gap-5 md:gap-10 h-full">
          <Select
            onValueChange={(e) => setDepartmentId(e)}
            defaultValue={departmentId}
          >
            <SelectTrigger className="w-[300px] h-[50px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departmentData?.map((department) => (
                <SelectItem value={department.id} key={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(e) => setYear(parseInt(e))}
            defaultValue={year.toString()}
          >
            <SelectTrigger className="w-[300px] h-[50px]">
              <SelectValue placeholder="Select Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"0"}>ALL</SelectItem>
              {years.map((year) => (
                <SelectItem value={year} key={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="col-span-5 md:col-span-3 h-[550px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl">GRAPH</h2>
        <StudentChart data={studentsData || []} />
      </div>
      <div className="col-span-5 md:col-span-2 h-[550px] shadow-md rounded-md p-4 md:p-8 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl">SUMMARY</h2>
        <StudentSummary
          data={studentsData || []}
          name={getSelectedDepartmentName || "..."}
          year={year.toString()}
          fullTotal={getFullTotal || 0}
        />
      </div>
    </div>
  );
};
export default StudentTab;
