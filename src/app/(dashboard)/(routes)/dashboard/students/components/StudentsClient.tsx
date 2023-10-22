"use client";
import React, { useState } from "react";
import StudentSearch from "./StudentSearch";
import { DataTable } from "@/components/DataTable";
import { columns } from "../columns";
import { UserWithProfile } from "@/types/types";
import { Gender } from "@prisma/client";

const StudentsClient = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const data: UserWithProfile[] = [
    {
      emailVerified: null,
      name: "Andsro Eugenio",
      role: "STUDENT",
      archive: false,
      id: "asdasdasdsdasd",
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
        gender: Gender.FEMALE,
        placeOfBirth: "Malolos Bulacan",
        yearEnrolled: new Date().toString(),
        religion: "Catholic",
        createdAt: new Date().toString(),
        id: "asdasd",
        province: "bulacan",
        middlename: "talla",
        studentNumber: "434341233221",
        updatedAt: new Date().toString(),
        userId: "asdasdasdasdasd",
        yearGraduated: new Date().toString(),
      },
    },

    {
      emailVerified: null,
      name: "Andrdso Eugenio",
      role: "STUDENT",
      archive: false,
      id: "asdasdasdsdasd",
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
        yearEnrolled: new Date().toString(),
        religion: "Catholic",
        createdAt: new Date().toString(),
        id: "asdasd",
        province: "bulacan",
        middlename: "talla",
        studentNumber: "434341233221",
        updatedAt: new Date().toString(),
        userId: "asdasdasdasdasd",
        yearGraduated: new Date().toString(),
      },
    },

    {
      emailVerified: null,
      name: "Andfro Eugenio",
      role: "STUDENT",
      archive: false,
      id: "asdasdasdsdasd",
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
        yearEnrolled: new Date().toString(),
        religion: "Catholic",
        createdAt: new Date().toString(),
        id: "asdasd",
        province: "bulacan",
        middlename: "talla",
        studentNumber: "434341233221",
        updatedAt: new Date().toString(),
        userId: "asdasdasdasdasd",
        yearGraduated: new Date().toString(),
      },
    },

    {
      emailVerified: null,
      name: "Anddsro Eugenio",
      role: "STUDENT",
      archive: false,
      id: "asdasdasdsdasd",
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
        gender: Gender.FEMALE,
        placeOfBirth: "Malolos Bulacan",
        yearEnrolled: new Date().toString(),
        religion: "Catholic",
        createdAt: new Date().toString(),
        id: "asdasd",
        province: "bulacan",
        middlename: "talla",
        studentNumber: "434341233221",
        updatedAt: new Date().toString(),
        userId: "asdasdasdasdasd",
        yearGraduated: new Date().toString(),
      },
    },
  ];


      
  return (
    <div className="flex flex-col p-10">
      <StudentSearch onChange={onFilter} />
      <DataTable
        columns={columns}
        data={data || []}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  );
};

export default StudentsClient;