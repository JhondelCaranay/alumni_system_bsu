"use client";

import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/queries/students";
import { columns } from "./columns";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AlumniStudentsClientProps = {};
const AlumniStudentsClient = (props: AlumniStudentsClientProps) => {
  const [role, setRole] = useState("student");

  const { data: alumniData } = useQuery({
    queryKey: ["students", role],
    queryFn: () => getStudents(`?role=${role}`),
  });

  const actionLinks = (
    <Select onValueChange={(value) => setRole(value as string)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="STUDENT">Students</SelectItem>
        <SelectItem value="ALUMNI">Alumni</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={alumniData || []}
        searchKeys={["School Year", "Department"]}
        actionLinks={actionLinks}
      />
    </div>
  );
};
export default AlumniStudentsClient;
