import { Button } from "@/components/ui/button";
import JobsClient from "./components/JobsClient";
import { PenSquare } from "lucide-react";
import Link from "next/link";
import { QueryClient } from "@tanstack/react-query";
import { queryFn } from "@/hooks/useTanstackQuery";

type JobsPageProps = {};
const JobsPage = async (props: JobsPageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["jobs"],
    queryFn: () => queryFn("/posts", {type: 'jobs'}),
  });

  return (
    <div className="flex flex-col p-5 md:p-10">
      <Link href={"/dashboard/jobs/create"} className="self-end pb-2">
        <Button className="w-fit ">
          <PenSquare className="w-5 h-5 mr-2" /> Post a job.{" "}
        </Button>
      </Link>

      <JobsClient />
    </div>
  );
};
export default JobsPage;
