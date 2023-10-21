"use client";

import { DataTable } from "@/components/ui/data-table";
import { getDeparments } from "@/queries/department";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type CoursesClientProps = {};
const CoursesClient = (props: CoursesClientProps) => {
  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: getDeparments,
  });

  const tableLinks = (
    <div className="flex justify-end">
      <Link href="/departments/create">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New departments
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="p-6">
      <DataTable columns={columns} data={departmentsData || []} tableLinks={tableLinks} />
    </div>
  );
};
export default CoursesClient;
