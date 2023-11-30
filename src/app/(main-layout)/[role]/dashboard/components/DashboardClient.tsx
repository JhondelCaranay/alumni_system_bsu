"use client";
import React, { useState } from "react";
import Widget from "./Widget";
import { AlumniChart, EventChart, JobsChart, StudentsChart } from "./Chart";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

const DashboardClient = () => {
  const [selected, setSelected] = useState<
    "" | "STUDENTS" | "ALUMNI" | "JOBS" | "EVENTS"
  >("");
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5">
        <div onClick={() => setSelected("ALUMNI")}>
          <Widget title="ALUMNI" total={99} icon={CircleDollarSign} />
        </div>
        <div onClick={() => setSelected("STUDENTS")}>
          <Widget title="STUDENTS" total={99} icon={File} />
        </div>
        <div onClick={() => setSelected("JOBS")}>
          <Widget title="JOBS" total={99} icon={LayoutDashboard} />
        </div>
        <div onClick={() => setSelected("EVENTS")}>
          <Widget title="EVENTS" total={99} icon={ListChecks} />
        </div>
      </div>
      <div className="flex flex-col gap-y-10 mt-10">
        <h1 className="text-center text-zinc-500 capitalize">{selected.toLowerCase()}</h1>
        {
            (() => {
                if (selected === 'ALUMNI') return <AlumniChart/>
                if (selected === 'STUDENTS') return <StudentsChart/>
                if (selected === 'JOBS') return <JobsChart/>
                if (selected === 'EVENTS') return <EventChart/>
            })()
        }
      </div>
    </div>
  );
};

export default DashboardClient;
