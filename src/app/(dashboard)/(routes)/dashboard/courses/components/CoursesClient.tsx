"use client";

import { DataTable } from "@/components/ui/data-table";
import { getDeparments } from "@/queries/department";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type CoursesClientProps = {};
const CoursesClient = (props: CoursesClientProps) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: getDeparments,
  });

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
      <DataTable
        columns={columns}
        data={departmentsData || []}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
};
export default CoursesClient;
