"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import {
  UserProfileWithDepartmentSection,
  UserWithProfile,
} from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalType, useModal } from "@/hooks/useModalStore";
import { query } from "@/lib/tanstack-query-processor";
import { Search, UserPlus, File, Filter } from "lucide-react";
import { capitalizeWords } from "@/lib/utils";
const StudentsClient = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const { onOpen } = useModal();

  const onModalOpen = (type: ModalType) => {
    onOpen(type, {});
  };

  const roles = ["All", "STUDENT", "ALUMNI", "PESO", "ADVISER", "COORDINATOR"];
  const departments = [
    "All",
    "STUDENT",
    "ALUMNI",
    "PESO",
    "ADVISER",
    "COORDINATOR",
  ];

  const students = query<UserProfileWithDepartmentSection[]>(`/users/`, null, [
    "users",
  ]);

  return (
    <div className="flex flex-col p-10">
      <div className="flex justify-end gap-x-5">
        <Button className="text-zinc-500 dark:text-white" variant={"outline"}>
          {" "}
          <UserPlus className="w-5 h-5 mr-2" /> Add student
        </Button>
        <Button
          className="text-zinc-500 dark:text-white"
          variant={"outline"}
          onClick={() => onModalOpen("importStudents")}
        >
          {" "}
          <File className="w-5 h-5 mr-2" /> Import students
        </Button>
      </div>

      <div className="flex items-center gap-5 my-10">
        <div className="border flex items-center rounded-md px-2 w-full flex-1">
          <Search className="w-5 h-5 font-semibold text-zinc-500 dark:text-white" />
          <Input
            className="inset-0 outline-none border-none active:outline-none hover:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            onChange={onFilter}
            type="text"
            placeholder="Search for Email, Department or something..."
          />
        </div>
        <Select>
          <SelectTrigger className="w-full flex-[0.3]  font-semibold text-zinc-500 dark:text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="w-full flex-[0.3] font-semibold text-zinc-500 dark:text-white">
            {roles?.map((value) => (
              <SelectItem value={value} key={value} className="cursor-pointer">
                {capitalizeWords(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full flex-[0.3]  font-semibold text-zinc-500 dark:text-white">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="w-full flex-[0.3] font-semibold text-zinc-500 dark:text-white">
            {departments?.map((value) => (
              <SelectItem value={value} key={value} className="cursor-pointer">
                {capitalizeWords(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="text-zinc-500 dark:text-white" onClick={() => {}}>
          <Filter className="w-6 h-6" /> Clear Filters
        </Button>
      </div>

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
