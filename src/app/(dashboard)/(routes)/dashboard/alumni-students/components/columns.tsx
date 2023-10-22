"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { SafeUserWithProfileWithDapartment } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, ArrowUpDown, Copy, Eye, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export const columns: ColumnDef<SafeUserWithProfileWithDapartment>[] = [
  // {
  //   id: "counter",
  //   header: () => {
  //     return <div className="sr-only">Counter</div>;
  //   },
  //   cell: ({ row }) => {
  //     const index = row.index + 1;

  //     return <div>{index}</div>;
  //   },
  // },
  // add id dont show it
  {
    accessorKey: "id",
    header: () => {
      return <div className="sr-only dark:text-white">Id</div>;
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string;

      return <div>{id}</div>;
    },
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const firstname = row.original.profile.firstname;
      return <div>{firstname}</div>;
    },
  },
  {
    accessorKey: "profile.middleName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Middle Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const middlename = row.original.profile.middlename;
      return <div>{middlename}</div>;
    },
  },
  {
    accessorKey: "profile.lastname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const lastname = row.original.profile.lastname;
      return <div>{lastname}</div>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <div>{role}</div>;
    },
  },
  {
    accessorKey: "School Year",
    accessorFn: (row) => {
      const schoolYear = row.profile.schoolYear?.toString();
      return schoolYear;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          School Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const schoolYear = row.original.profile.schoolYear;
      return <div>{schoolYear}</div>;
    },
  },
  {
    accessorKey: "Department",
    accessorFn: (row) => {
      const name = row.department.name;
      return name;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.department.name;
      return <div>{name}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Department ID copied to clipboard.");
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-4 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCopy(id)}>
                <Copy className="mr-2 h-4 w-4" /> Copy Id
              </DropdownMenuItem>
              <Link href={`/students/${id}`}>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
              </Link>
              <Link href={`/students/${id}`}>
                <DropdownMenuItem>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-100">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
