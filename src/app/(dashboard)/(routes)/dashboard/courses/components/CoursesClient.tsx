"use client";

import { DataTable } from "@/components/ui/data-table";
import { getDeparments } from "@/queries/department";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

type CoursesClientProps = {};
const CoursesClient = (props: CoursesClientProps) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: getDeparments,
  });

  if (departmentsQuery.isError) {
    return <div>Error...</div>;
  }

  if (departmentsQuery.isPending) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center space-x-2 pb-4">
        <h1 className="text-xl font-bold">DEPARTMENT</h1>
        <div className="flex gap-4">
          <Link href="/dashboard/students/add">
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </Link>
        </div>
      </div>

      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:md:sm:grid-cols-4 gap-4 py-4">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => {
            setGlobalFilter(String(event.target.value));
          }}
          className="w-full"
        />
      </div>
      <DataTable
        columns={columns}
        data={departmentsQuery.data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
};
export default CoursesClient;
