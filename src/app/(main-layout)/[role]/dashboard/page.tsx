import Widget from "./components/Widget";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";

type DashBoardHomePageProps = {};
const DashBoardHomePage = (props: DashBoardHomePageProps) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5">
        <Widget title="ALUMNI" total={99} icon={CircleDollarSign} />
        <Widget title="STUDENTS" total={99} icon={File} />
        <Widget title="JOBS" total={99} icon={LayoutDashboard} />
        <Widget title="EVENTS" total={99} icon={ListChecks} />
      </div>
    </div>
  );
};
export default DashBoardHomePage;
