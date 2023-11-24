import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { format } from "date-fns";
import React from "react";

type GeneralUserInfoProps = {
  data: GetCurrentUserType;
};


const DATE_FORMAT = `d MMM yyyy`;

const GeneralUserInfo: React.FC<GeneralUserInfoProps> = ({ data }) => {
  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-[#1F2937] p-5 rounded-lg gap-y-10">
      <h1 className="text-3xl">General Information</h1>
      
      <div className="flex justify-evenly">
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">First Name</label>
            <span className="capitalize text-sm">{data?.profile?.firstname || '-'}</span>
        </div>
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Last Name</label>
            <span className="capitalize text-sm">{data?.profile?.lastname || '-'}</span>
        </div>
      </div>

      <div className="flex justify-evenly">
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Middle Name</label>
            <span className="capitalize text-sm">{data?.profile?.middlename || '-'}</span>
        </div>
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Phone Number</label>
            <span className="capitalize text-sm">{data?.profile?.contactNo || '-'}</span>
        </div>
      </div>


      <div className="flex justify-evenly">
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">BSU Email</label>
            <span className=" text-sm">{data?.email ||  '-'}</span>
        </div>
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Personal Email</label>
            <span className="text-sm"> { data?.profile?.alternative_email || '-'}</span>
        </div>
      </div>

      <div className="flex justify-evenly">
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Home Number</label>
            <span className=" text-sm">{ data?.profile?.homeNo ||  '-'}</span>
        </div>
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Street</label>
            <span className="text-sm"> {data?.profile?.street|| '-'}</span>
        </div>
      </div>


      <div className="flex justify-evenly">

      <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Barangay</label>
            <span className="text-sm"> {data?.profile?.barangay|| '-'}</span>
        </div>

        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Province</label>
            <span className="capitalize text-sm">{ data?.profile?.province || '-'}</span>
        </div>
        
      </div>

      <div className="flex justify-evenly">
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">City</label>
            <span className="text-sm"> {data?.profile?.city|| '-'}</span>
        </div>
        <div className="flex flex-col items-start flex-1">
            <label className="text-md dark:text-zinc-400" htmlFor="">Date created</label>
            <span className="text-sm"> {format(new Date(data?.createdAt || new Date()), DATE_FORMAT)}</span>
        </div>
      </div>


    </div>
  );
};

export default GeneralUserInfo;
