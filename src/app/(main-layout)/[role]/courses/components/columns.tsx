"use client";

import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  ArrowUpDown,
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

import { DepartmentSchemaType } from "@/schema/department";
import ActionCell from "./ActionCell";

export const columns: ColumnDef<DepartmentSchemaType>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "courseYear",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=" dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      const formatted = format(new Date(createdAt), "MM/dd/yyyy");

      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionCell data={row.original} />;
    },
  },
];
