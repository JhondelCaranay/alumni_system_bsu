"use client";

import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/queries/students";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import q from "query-string";

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
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type AlumniClientProps = {};
const AlumniClient = (props: AlumniClientProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [role, setRole] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [department, setDepartment] = useState("");

  const [query, setQuery] = useState("");

  useEffect(() => {
    const query = q.stringify(
      {
        role,
        schoolYear,
        department,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    setQuery(query);
  }, [role, schoolYear, department]);

  const { data: alumniData } = useQuery({
    queryKey: ["students", query],
    queryFn: () => getStudents(query),
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getDeparments(),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center space-x-2 pb-4">
        <h1 className="text-xl font-bold">STUDENTS</h1>
        <div className="flex gap-4">
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

          <Link href="/dashboard/students/add">
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Student
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
        <Select value={role} onValueChange={(value) => setRole(value === "All" ? "" : value)}>
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
            {departmentsData?.map((department) => (
              <SelectItem value={department.name} key={department.name}>{department.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={alumniData || []}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        // searchKeys={["School Year", "Department"]}
      />
    </div>
  );
};
export default AlumniClient;
