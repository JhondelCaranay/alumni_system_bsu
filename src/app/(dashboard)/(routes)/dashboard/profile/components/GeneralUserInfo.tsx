import { GetCurrentUserType } from "@/actions/getCurrentUser";
import React from "react";

type GeneralUserInfoProps = {
  data: GetCurrentUserType;
};

const GeneralUserInfo: React.FC<GeneralUserInfoProps> = ({ data }) => {
  return (
    <div className="flex flex-1 flex-col bg-[#1F2937] p-5 rounded-lg gap-y-10">
      <h1 className="text-3xl">General Information</h1>

      <div className="flex flex-col">
        <h2 className="text-xl">About me</h2>

        <p className="mt-5 dark:text-zinc-300">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos
          repellendus, officiis necessitatibus consequatur blanditiis
          reprehenderit dolores tempora non eligendi, aut inventore vero odit
          voluptates deleniti asperiores sit distinctio! Incidunt quo vitae
          facilis commodi ipsum quisquam porro molestias voluptate ex vel
          numquam sapiente, maxime quam, illo eveniet inventore architecto
          labore aliquid?
        </p>
      </div>

      
      

      <div className="flex justify-evenly">
      <div className="flex flex-col items-start flex-1">
            <label className="text-sm dark:text-zinc-400" htmlFor="">Student Number</label>
            <span>{data?.profile?.studentNumber || '-'}</span>
        </div>

        <div className="flex flex-col items-start flex-1">
            <label className="text-sm dark:text-zinc-400" htmlFor="">Year Enrolled</label>
            <span className="capitalize">{data?.profile?.yearEnrolled?.getFullYear() || '-'}</span>
        </div>
        
      </div>

      <div className="flex justify-evenly">
        <div className="flex flex-col items-start flex-1">
            <label className="text-sm dark:text-zinc-400" htmlFor="">Department</label>
            <span className="capitalize">{data?.department?.name.toLowerCase() || '-'}</span>
        </div>
        <div className="flex flex-col items-start flex-1">
            <label className="text-sm dark:text-zinc-400" htmlFor="">Section</label>
            <span> {data?.section ? ` ${data.section.year} - ${data.section.name}` : '-'}</span>
        </div>
      </div>

      <div className="flex justify-evenly">
        <div className="flex flex-col items-start flex-1">
            <label className="text-sm dark:text-zinc-400" htmlFor="">Phone Number</label>
            <span className="capitalize">{data?.profile?.contactNo || '-'}</span>
        </div>
        <div className="flex flex-col items-start flex-1">
            <label className="text-sm dark:text-zinc-400" htmlFor="">Email</label>
            <span> {data?.email || data?.profile?.alternative_email || '-'}</span>
        </div>
      </div>

      <div className="flex justify-evenly">
        <div className="flex flex-col items-start flex-1">
            <label className="text-sm dark:text-zinc-400" htmlFor="">Address</label>
            <span className="capitalize">{ `${ data?.profile?.homeNo} ${data?.profile?.street} ${data?.profile?.barangay} ${data?.profile?.province}` || '-'}</span>
        </div>
        <div className="flex flex-col items-start flex-1">
            <label className="text-sm dark:text-zinc-400" htmlFor="">City</label>
            <span> {data?.profile?.city|| '-'}</span>
        </div>
      </div>


    </div>
  );
};

export default GeneralUserInfo;
