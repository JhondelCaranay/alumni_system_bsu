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
  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: getDeparments,
  });

  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <div className="flex items-center gap-5 md:gap-10 h-full">
          <Select>
            <SelectTrigger className="w-[300px] h-[50px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departmentsQuery?.data?.map((department) => (
                <SelectItem value={department.name} key={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[300px] h-[50px]">
              <SelectValue placeholder="Select Years" />
            </SelectTrigger>
            <SelectContent>
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
        <StudentChart />
      </div>
      <div className="col-span-5 md:col-span-2 h-[550px] shadow-md rounded-md p-4 md:p-8 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl">SUMMARY</h2>
        <StudentSummary name="COMPUTER" year="2023" />
      </div>
    </div>
  );
};
export default StudentTab;
