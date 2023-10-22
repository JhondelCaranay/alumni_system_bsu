"use client";

import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/queries/students";
import { columns } from "./columns";

type AlumniClientProps = {};
const AlumniClient = (props: AlumniClientProps) => {
  const { data: alumniData } = useQuery({
    queryKey: [
      "students",
      {
        role: "alumni",
      },
    ],
    queryFn: () => getStudents(`?role=alumni`),
  });

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={alumniData || []}
        searchKeys={["School Year", "Department"]}
      />
    </div>
  );
};
export default AlumniClient;
