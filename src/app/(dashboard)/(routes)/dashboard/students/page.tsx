import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { UserWithProfile } from "@/types/types";
import { Gender } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Users, UserPlus, File} from 'lucide-react'
type StudentsPageProps = {};

const StudentsPage = (props: StudentsPageProps) => {
  const data: UserWithProfile[] = [
    {
      emailVerified: null,
      name: "Andro Eugenio",
      role: "STUDENT",
      archive: false,
      id: "asdasdasdsdasd",
      username: "54102321",
      createdAt: "",
      updatedAt: "",
      email: "Menandroeugenio1028@gmail.com",
      image: "https://avatars.githubusercontent.com/u/92616982?v=4",
      departmentId: null,
      sectionId: null,
      profile: {
        firstname: "Andro",
        lastname: "Eugenio",
        age: 23,
        barangay: "San Sebastian",
        alternative_email: "Menandroeugenio1028@gmail.com",
        city: "Hagonoy",
        contactNo: "09561289642",
        corUrl: "----",
        dateOfBirth: "",
        homeNo: "523",
        street: "Del pilar st",
        gender: Gender.MALE,
        placeOfBirth: "Malolos Bulacan",
        yearEnrolled: new Date(),
        religion: "Catholic",
        createdAt: new Date(),
        id: "asdasd",
        province: "bulacan",
        middlename: "talla",
        studentNumber: "434341233221",
        updatedAt: new Date(),
        userId: "asdasdasdasdasd",
        yearGraduated: new Date(),
      },
    },

    {
      emailVerified: null,
      name: "Andro Eugenio",
      role: "STUDENT",
      archive: false,
      id: "asdasdasdsdasd",
      username: "54102321",
      createdAt: "",
      updatedAt: "",
      email: "Menandroeugenio1028@gmail.com",
      image: "https://avatars.githubusercontent.com/u/92616982?v=4",
      departmentId: null,
      sectionId: null,

      profile: {
        firstname: "Andro",
        lastname: "Eugenio",
        age: 23,
        barangay: "San Sebastian",
        alternative_email: "Menandroeugenio1028@gmail.com",
        city: "Hagonoy",
        contactNo: "09561289642",
        corUrl: "----",
        dateOfBirth: "",
        homeNo: "523",
        street: "Del pilar st",
        gender: Gender.MALE,
        placeOfBirth: "Malolos Bulacan",
        yearEnrolled: new Date(),
        religion: "Catholic",
        createdAt: new Date(),
        id: "asdasd",
        province: "bulacan",
        middlename: "talla",
        studentNumber: "434341233221",
        updatedAt: new Date(),
        userId: "asdasdasdasdasd",
        yearGraduated: new Date(),
      },
    },

    {
      emailVerified: null,
      name: "Andro Eugenio",
      role: "STUDENT",
      archive: false,
      id: "asdasdasdsdasd",
      username: "54102321",
      createdAt: "",
      updatedAt: "",
      email: "Menandroeugenio1028@gmail.com",
      image: "https://avatars.githubusercontent.com/u/92616982?v=4",
      departmentId: null,
      sectionId: null,
      profile: {
        firstname: "Andro",
        lastname: "Eugenio",
        age: 23,
        barangay: "San Sebastian",
        alternative_email: "Menandroeugenio1028@gmail.com",
        city: "Hagonoy",
        contactNo: "09561289642",
        corUrl: "----",
        dateOfBirth: "",
        homeNo: "523",
        street: "Del pilar st",
        gender: Gender.MALE,
        placeOfBirth: "Malolos Bulacan",
        yearEnrolled: new Date(),
        religion: "Catholic",
        createdAt: new Date(),
        id: "asdasd",
        province: "bulacan",
        middlename: "talla",
        studentNumber: "434341233221",
        updatedAt: new Date(),
        userId: "asdasdasdasdasd",
        yearGraduated: new Date(),
      },
    },

    {
      emailVerified: null,
      name: "Andro Eugenio",
      role: "STUDENT",
      archive: false,
      id: "asdasdasdsdasd",
      username: "54102321",
      createdAt: "",
      updatedAt: "",
      email: "Menandroeugenio1028@gmail.com",
      image: "https://avatars.githubusercontent.com/u/92616982?v=4",
      departmentId: null,
      sectionId: null,

      profile: {
        firstname: "Andro",
        lastname: "Eugenio",
        age: 23,
        barangay: "San Sebastian",
        alternative_email: "Menandroeugenio1028@gmail.com",
        city: "Hagonoy",
        contactNo: "09561289642",
        corUrl: "----",
        dateOfBirth: "",
        homeNo: "523",
        street: "Del pilar st",
        gender: Gender.MALE,
        placeOfBirth: "Malolos Bulacan",
        yearEnrolled: new Date(),
        religion: "Catholic",
        createdAt: new Date(),
        id: "asdasd",
        province: "bulacan",
        middlename: "talla",
        studentNumber: "434341233221",
        updatedAt: new Date(),
        userId: "asdasdasdasdasd",
        yearGraduated: new Date(),
      },
    },
  ];

  return (
    <div className="flex flex-col p-10">
      <div className="flex items-center gap-5 my-10">
        <div className="border flex items-center rounded-md px-2 flex-1">
          <Search className="w-5 h-5 text-zinc-400" />
          <Input className="inset-0 outline-none border-none active:outline-none hover:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" type="text" placeholder="Search for studentNo, email, course or something..." />
        </div>
        <Button className="bg-[#0369A1] hover:bg-[#034da1] text-sm"> <UserPlus className="w-5 h-5 mr-2" /> Create student</Button>
        <Button className="bg-[#0369A1] hover:bg-[#034da1] text-sm"> <File className="w-5 h-5 mr-2" /> Import students</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
export default StudentsPage;
