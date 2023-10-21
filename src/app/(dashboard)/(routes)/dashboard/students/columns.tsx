"use client";
import { ArrowUpDown, MoreHorizontal, MoreVertical, ShieldEllipsis } from "lucide-react";
import Avatar from "@/components/Avatar";
import { Profile, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User & { profile: Profile }>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        className="text-[#003171] text-center flex items-center justify-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const email = row.original.email;
      const image = row.original.image;
      return (
        <div className={`text-center flex items-center justify-center`}>
          <Avatar src={image} className="mr-3" /> {email}
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <div
        className="text-[#003171] text-center flex items-center justify-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student No. <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const studentNo = row.getValue("username") as string;
      return <div className={`text-center`}>{studentNo}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div
        className="text-[#003171] text-center flex items-center justify-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className={`text-center flex items-center justify-center`}>
          {" "}
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "profile.gender",
    header: ({ column }) => (
      <div
        className="text-[#003171] text-center flex items-center justify-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Gender <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      return <div className={`text-center`}>{"Male"}</div>;
    },
  },

  {
    accessorKey: "courseId",
    header: ({ column }) => (
      <div
        className="text-[#003171] text-center flex items-center justify-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Course & Section <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      //  const name = row.getValue('name') as string

      return <div className={`text-center`}>{"Automotive 1-A"}</div>;
    },
  },
  {
    accessorKey: "yearEnrolled",
    header: ({ column }) => (
      <div
        className="text-[#003171] text-center flex items-center justify-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year Enrolled <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      return <div className={`text-center`}>{new Date().getFullYear()}</div>;
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="text-[#003171] text-center flex items-center justify-center cursor-pointer"></div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      return (
        <div className={`text-center`}>
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
