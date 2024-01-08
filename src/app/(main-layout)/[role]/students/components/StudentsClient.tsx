"use client";

import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { getStudents, getStudentsQuery } from "@/queries/students";
import { columns } from "./columns";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDeparments } from "@/queries/department";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, File } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModalStore";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { SafeUserWithProfileWithDapartmentWithSection } from "@/types/types";

type StudentsClientProps = {};
const StudentsClient = (props: StudentsClientProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [role, setRole] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [department, setDepartment] = useState("");
  const { onOpen } = useModal();

  const queries: getStudentsQuery = {
    role,
    schoolYear,
    department,
  };

  // const studentsQuery = useQuery({
  //   queryKey: ["students", { queries }],
  //   queryFn: () => getStudents(queries),
  // });

  const students = useQueryProcessor<
    SafeUserWithProfileWithDapartmentWithSection[]
  >(
    "/students",
    {
      role,
      schoolYear,
      department,
    },
    ["students/alumni"]
  );

  useEffect(() => {
    students.refetch();
  }, [role, schoolYear, department]);

  console.log(students.data);
  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: () => getDeparments(),
  });

  if (
    // studentsQuery.isError || 
    departmentsQuery.isError || students.isError) {
    return <div>Error...</div>;
  }

  if (
    // studentsQuery.isPending ||
    departmentsQuery.isPending ||
    students.isPending
  ) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center space-x-2 pb-4">
        <h1 className="text-xl font-bold">STUDENTS</h1>
        <div className="flex gap-4">
          <div className="flex justify-end gap-x-5">
            <Button
              className="text-zinc-500 dark:text-white"
              variant={"outline"}
              onClick={() => onOpen("createStudent")}
            >
              {" "}
              <UserPlus className="w-5 h-5 mr-2" /> Add student
            </Button>
            <Button
              className="text-zinc-500 dark:text-white"
              variant={"outline"}
              onClick={() => onOpen("importStudents")}
            >
              {" "}
              <File className="w-5 h-5 mr-2" /> Import students
            </Button>

            <Button
              className="text-zinc-500 dark:text-white"
              variant={"outline"}
              onClick={() => onOpen("bulkUpdateStudents")}
            >
              {" "}
              <File className="w-5 h-5 mr-2" /> Update students
            </Button>
          </div>
          {/* clear filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRole("");
              setSchoolYear("");
              setDepartment("");
            }}
          >
            Clear Filters
          </Button>

          {/* <Link href="/dashboard/students/add">
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </Link> */}
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
        <Select
          value={role}
          onValueChange={(value) => setRole(value === "All" ? "" : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="ALUMNI">Alumni</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={schoolYear}
          onValueChange={(value) => setSchoolYear(value === "All" ? "" : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="School Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={department}
          onValueChange={(value) => setDepartment(value === "All" ? "" : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {departmentsQuery.data.map((department) => (
              <SelectItem value={department.name} key={department.id}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={students.data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        // searchKeys={["School Year", "Department"]}
      />
    </div>
  );
};
export default StudentsClient;
