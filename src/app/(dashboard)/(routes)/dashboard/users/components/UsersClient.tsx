"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import {
  SafeDeparment,
  UserProfileWithDepartmentSection,
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
import { Role } from "@prisma/client";
const StudentsClient = () => {

  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const { onOpen } = useModal();

  const onModalOpen = (type: ModalType) => {
    onOpen(type, {});
  };

  const roles = Object.values(Role).filter((role) => role != 'ADMIN');

  const departments = query<SafeDeparment['name'][]>(`/departments`, {}, [
    "deparments",
  ], {
    select: (data:SafeDeparment[]) => {
      const newData = data.map((d) => d.name)
      return newData;
    }
  });

  type RoleType = (typeof roles)[number]
  const [role, setRole] = useState<'All' | RoleType >('All')
  const [department, setDepartment] = useState('All')

  const users = query<UserProfileWithDepartmentSection[]>(`/users`, { role, department }, [
    "users",
  ], {
    enabled: typeof departments.data != 'undefined'
  });

  useEffect(() => {
    users.refetch()
}, [role, department])

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
            value={globalFilter}
            placeholder="Search for Email, Department or something..."
          />
        </div>
        <Select value={role} onValueChange={(value:RoleType) => setRole(value)}>
          <SelectTrigger className="w-full flex-[0.3]  font-semibold text-zinc-500 dark:text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="w-full flex-[0.3] font-semibold text-zinc-500 dark:text-white">
          <SelectItem value={'All'} key={'All'} className="cursor-pointer">
                {capitalizeWords('All')}
              </SelectItem>
            {roles?.map((value) => (
              <SelectItem value={value} key={value} className="cursor-pointer">
                {capitalizeWords(value).replaceAll('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={department} onValueChange={(value) => setDepartment(value)}>
          <SelectTrigger className="w-full flex-[0.3]  font-semibold text-zinc-500 dark:text-white">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="w-full flex-[0.3] font-semibold text-zinc-500 dark:text-white">
            <SelectItem value={'All'} key={'All'} className="cursor-pointer">
                {capitalizeWords('All')}
              </SelectItem>

            {departments?.data?.map((value) => (
              <SelectItem value={value} key={value} className="cursor-pointer">
                {capitalizeWords(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="text-zinc-500 dark:text-white" onClick={() => {
          setRole("All");
          setDepartment("All");
          setGlobalFilter(prev => '')
        }}>
          <Filter className="w-5 h-5 text-zinc-500" /> Clear Filters
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users?.data || []}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
};

export default StudentsClient;
