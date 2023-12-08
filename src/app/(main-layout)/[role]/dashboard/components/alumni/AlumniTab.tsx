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
      <div className="col-span-5 h-[100px] shadow-md rounded-md p-5 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <div className="flex items-center gap-10 h-full">
          <Input
            type="number"
            placeholder="Year Start"
            className="w-[300px] h-full"
          />
          <Input
            type="number"
            placeholder="Year End"
            className="w-[300px] h-full"
          />
        </div>
      </div>
      <div className="col-span-3 h-[550px] shadow-md rounded-md p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl">STUDENTS</h2>
        <AlumniChart />
      </div>
      <div className="col-span-2 h-[550px] shadow-md rounded-md p-8 pb-10 dark:shadow-none dark:bg-slate-900 dark:text-white">
        <h2 className="text-center font-bold text-xl sticky top-0">SUMMARY</h2>
        <div className="overflow-y-auto h-full mt-2">
          <AlumniSummary />
        </div>
      </div>
    </div>
  );
};
export default AlumniTab;
