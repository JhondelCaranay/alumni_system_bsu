import StudentSummary from "../students/StudentSummary";
import AlumniChart from "./AlumniChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AlumniSummary from "./AlumniSummary";
import { Input } from "@/components/ui/input";
const AlumniTab = () => {
  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-5 md:col-span-3 flex flex-col gap-5">
        <div className="shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
          <div className="flex flex-wrap items-center gap-5 md:gap-10 h-full">
            <Input
              type="number"
              placeholder="Year Start"
              className="w-full md:w-[300px] h-[50px]"
            />
            <Input
              type="number"
              placeholder="Year End"
              className="w-full md:w-[300px] h-[50px]"
            />
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
