import { Button } from "@/components/ui/button";
import JobsClient from "./components/JobsClient";
import { PenSquare } from "lucide-react";
import Link from "next/link";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { queryFn } from "@/hooks/useTanstackQuery";
import getCurrentUser from "@/actions/getCurrentUser";

type JobsPageProps = {};
const JobsPage = async (props: JobsPageProps) => {
  const currentUser = await getCurrentUser();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["jobs"],
    queryFn: () => queryFn("/posts", { type: "jobs" }),
  });

  // this roles can post a job
  const allowedRoles = ["ADMIN", "BULSU_PARTNER", "PESO"];

  return (
    <div className="flex flex-col p-5 md:p-10 pb-0">
      {currentUser && allowedRoles.includes(currentUser?.role) && (
        <Link href={"/dashboard/jobs/create"} className="self-end pb-2">
          <Button className="w-fit dark:text-white">
            <PenSquare className="w-5 h-5 mr-2" /> Post a job.{" "}
          </Button>
        </Link>
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <JobsClient />
      </HydrationBoundary>
    </div>
  );
};
export default JobsPage;
