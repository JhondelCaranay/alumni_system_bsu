import { Button } from "@/components/ui/button";
import JobsClient from "./components/JobsClient";
import { PenSquare } from "lucide-react";
import Link from "next/link";

type JobsPageProps = {};
const JobsPage = (props: JobsPageProps) => {
  return (
    <div className="flex flex-col p-10">

      <Link href={"/dashboard/jobs/create"} className="self-end">
        <Button className="w-fit ">
          <PenSquare className="w-5 h-5 mr-2" /> Post a job.{" "}
        </Button>
      </Link>

      <JobsClient />
    </div>
  );
};
export default JobsPage;
