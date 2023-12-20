import StudentSummary from "../students/StudentSummary";
import JobChart from "./JobChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobSummary from "./JobSummary";
import { Input } from "@/components/ui/input";

const departments = [
  "AUTOMOTIVE",
  "COMPUTER",
  "DRAFTING",
  "EIR",
  "EEC",
  "FOODS",
  "MECHANICAL",
];

const JobTab = () => {
  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 md:col-span-3 flex flex-col gap-5">
        <div className="shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <div className="flex items-center gap-10 h-full">
            <Select>
              <SelectTrigger className="w-full md:w-[300px] h-[50px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem value={department} key={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-[550px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <h2 className="text-center font-bold text-xl">GRAPH</h2>
          <JobChart />
        </div>
      </div>

      <div className="col-span-5 md:col-span-2 h-full max-h-[660px] shadow-md rounded-md p-4 md:p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl sticky top-0">SUMMARY</h2>
        <div className="overflow-y-auto h-[90%] mt-2">
          <JobSummary />
        </div>
      </div>
    </div>
  );
};
export default JobTab;
