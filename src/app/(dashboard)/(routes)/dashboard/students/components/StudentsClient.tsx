"use client";
import React, { useState } from "react";
import StudentSearch from "./StudentSearch";
import { DataTable } from "@/components/DataTable";
import { columns } from "../columns";
import { UserProfileWithDepartmentSection, UserWithProfile } from "@/types/types";
import { Gender } from "@prisma/client";
import { query } from "@/lib/tanstack-query-processor";

const StudentsClient = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const students = query<UserProfileWithDepartmentSection[]>(`/students/`,null,['students']);

  return (
    <div className="flex flex-col p-10">
      <StudentSearch onChange={onFilter} />
      <DataTable
        columns={columns}
        data={students?.data || []}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
};

export default StudentsClient;
