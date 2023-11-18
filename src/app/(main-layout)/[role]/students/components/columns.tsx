"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SafeUserWithProfileWithDapartmentWithSection } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, ArrowUpDown, Copy, Eye, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { capitalizeWords, cn } from "@/lib/utils";
import Avatar from "@/components/Avatar";

export const columns: ColumnDef<SafeUserWithProfileWithDapartmentWithSection>[] = [
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

      return <div className="sr-only dark:text-white">{id}</div>;
    },
  },
  {
    accessorKey: "len",
    accessorFn: (row) => {
      const studentNumber = row.profile.studentNumber;
      return studentNumber;
    },
    header: ({ column }) => {
      return <div className="sr-only dark:text-white">LRN</div>;
    },
    cell: ({ row }) => {
      const studentNumber = row.original.profile.studentNumber;
      return <div className="sr-only dark:text-white">{studentNumber}</div>;
    },
  },
  {
    accessorKey: "avatar",
    accessorFn: (row) => {
      const email = row.email;
      return email;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const image = row.original.image;
      const email = row.original.email;
      return (
        <div className={`flex items-center justify-start`}>
          <Avatar src={image} className="mr-3" /> {email}
        </div>
      );
    },
  },
  {
    accessorKey: "fullname",
    accessorFn: (row) => {
      const firstname = row.profile.firstname;
      const lastname = row.profile.lastname;
      return `${firstname} ${lastname}`;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const firstname = row.original.profile.firstname;
      const lastname = row.original.profile.lastname;
      return (
        <div>
          {firstname} {lastname}
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    accessorFn: (row) => {
      const gender = row.profile.gender;
      return `${gender}`;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gender
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const gender = row.original.profile.gender;
      return <div>{capitalizeWords(gender)}</div>;
    },
  },

  {
    accessorKey: "job",
    accessorFn: (row) => {
      const job = row.profile.isEmployed ? "Employed" : "Unemployed";
      return job;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isEmployed = row.original.profile.isEmployed;

      return (
        <Badge className={cn("bg-slate-500 dark:text-white", isEmployed && "bg-sky-700")}>
          {isEmployed ? "Employed" : "Unemployed"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "role",
    accessorFn: (row) => {
      const role = row.role;
      return role;
    },
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
      const final = capitalizeWords(role);

      return (
        <Badge className={cn("bg-slate-500 dark:text-white", role === "ALUMNI" && "bg-sky-700")}>
          {final}
        </Badge>
      );
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
      const { id, profile } = row.original;

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
              <DropdownMenuItem
                onClick={() => profile.studentNumber && onCopy(profile.studentNumber)}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy LRN
              </DropdownMenuItem>
              <Link href={`/dashboard/students/${id}`}>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/students/${id}`}>
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
