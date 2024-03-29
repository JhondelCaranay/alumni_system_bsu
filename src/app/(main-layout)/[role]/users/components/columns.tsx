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
import { UserProfileWithDepartmentSection } from "@/types/types";
import { capitalizeWords, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ActionButton from "./ActionButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<UserProfileWithDepartmentSection>[] = [
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
    accessorKey: "name",
    accessorFn: (row) => {
      const { firstname, middlename, lastname } = row.profile || {};
      if (!firstname && !middlename && !lastname) {
        return row.name;
      }

      const fullname = `${firstname} ${middlename?.charAt(0)}. ${lastname}`;
      return `${firstname} ${middlename} ${lastname}`;
    },
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const {firstname, middlename, lastname} = row.original.profile
      const { firstname, middlename, lastname } = row.original.profile || {};

      if (!firstname && !middlename && !lastname) {
        return <div className={` flex items-center`}> {row.original.name}</div>;
      }

      const fullname = `${firstname} ${middlename?.charAt(0)}. ${lastname}`;

      return <div className={` flex items-center`}>{fullname}</div>;
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => {
      const { email } = row;
      return email;
    },
    header: ({ column }) => (
      <div
        className="text-[#003171] flex items-center cursor-pointer dark:text-white flex-1"
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
    accessorKey: "profile.province",
    accessorFn: (row) => {
      const { homeNo, city, street, province, barangay } = row.profile || {};
      if (!homeNo && !city && !street && !province && !barangay) {
        return "Unknown";
      }
      const address = `${street} ${homeNo}-${barangay} ${city} ${province}`;
      return address;
    },
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Address <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const studentNo = row.original.profile?.studentNumber as string;
      const { homeNo, city, street, province, barangay } =
        row.original.profile || {};
      if (!homeNo && !city && !street && !province && !barangay) {
        return "Unknown";
      }
      const address = `${street} ${homeNo}-${barangay} ${city} ${province}`;
      return <div className={``}>{address}</div>;
    },
  },
  {
    accessorKey: "profile.gender",
    accessorFn: (row) => {
      const { gender } = row.profile;
      return gender;
    },
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Gender <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      const gender = row.original.profile?.gender as string;

      return (
        <div className={`text-center`}>
          {" "}
          <Badge
            className={cn(
              "dark:text-white bg-slate-500",
              gender === "FEMALE" && "bg-rose-500",
              gender === "MALE" && "bg-sky-700"
            )}
          >
            {capitalizeWords(gender)}
          </Badge>{" "}
        </div>
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
      const role = row.original?.role as string;
      const final = capitalizeWords(role).replaceAll("_", " ");

      const upperRole = ["ADVISER", "COORDINATOR", "BULSU_PARTNER", "PESO"];
      return (
        <div className="text-center">
          <Badge
            className={cn(
              "bg-slate-500 dark:text-white",
              role === "ALUMNI" && "bg-sky-700",
              upperRole.includes(role) && "bg-indigo-500"
            )}
          >
            {final}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "department.id",
    accessorFn: (row) => {
      const { name } = row.department || {};
      return name;
    },
    header: ({ column }) => (
      <div
        className="text-[#003171]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Department <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const { name } = row.original.department || {};

      return <div className={`text-center`}>{capitalizeWords(name)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => {
      return null;
    },
    header: ({ column }) => (
      <div className="text-[#003171]  flex items-center cursor-pointer dark:text-white flex-1"></div>
    ),
    cell: ({ row }) => {
      return <ActionButton user={row.original} />;
    },
  },
];
