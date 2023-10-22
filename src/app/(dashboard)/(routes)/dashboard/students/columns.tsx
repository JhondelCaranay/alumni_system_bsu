"use client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Avatar from "@/components/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SafeProfile, SafeUser, UserProfileWithDepartmentSection } from "@/types/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<UserProfileWithDepartmentSection>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        className="text-[#003171] flex items-center cursor-pointer dark:text-white"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const email = row.original?.email;
      const image = row.original?.image;
      return (
        <div className={` flex items-center`}>
          <Avatar src={image} className="mr-3" /> {email}
        </div>
      );
    },
  },
  {
    accessorKey: "profile.studentNumber",
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const studentNo = row.original.profile?.studentNumber as string;
      return <div className={``}>{studentNo}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const name = row.original.name as string;

      return <div className={` flex items-center`}> {name}</div>;
    },
  },
  {
    accessorKey: "profile.gender",
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Gender <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      const gender = row.original.profile?.gender as string;

      return <div className={``}>{gender}</div>;
    },
  },

  


  {
    accessorKey: "courseId",
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Course & Section <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      //  const name = row.getValue('name') as string

      return <div className={``}>{"Automotive 1-A"}</div>;
    },
  },
  {
    accessorKey: "yearEnrolled",
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year Enrolled <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      return <div className={``}>{new Date().getFullYear()}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="text-[#003171]  flex items-center cursor-pointer dark:text-white"></div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      return (
        <div className={``}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="h-4 w-4 text-zinc-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-xs">Update</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  
  
];
