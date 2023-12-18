"use client";
import React, { useState } from "react";
import Widget from "./Widget";
import {
  LucideUserSquare2,
  LayoutDashboard,
  ListChecks,
  GraduationCap,
} from "lucide-react";
import AlumniTab from "./alumni/AlumniTab";
import StudentTab from "./students/StudentsTab";
import JobTab from "./jobs/JobTab";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useRouterPush from "@/hooks/useRouterPush";
import { useQuery } from "@tanstack/react-query";
import { getDashboardWidget } from "@/queries/dashboard";

const DashboardClient = () => {
  const totalsQuery = useQuery({
    queryKey: ["todos"],
    queryFn: getDashboardWidget,
  });

  const { redirectTo } = useRouterPush();

  const [selected, setSelected] = useState<
    "" | "STUDENTS" | "ALUMNI" | "JOBS" | "EVENTS"
  >("STUDENTS");

  return (
    <div className="p-6">
      {totalsQuery.data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div onClick={() => setSelected("STUDENTS")}>
            <Widget
              title="STUDENTS"
              total={totalsQuery.data?.students || 0}
              icon={LucideUserSquare2}
            />
          </div>
          <div onClick={() => setSelected("ALUMNI")}>
            <Widget
              title="ALUMNI"
              total={totalsQuery.data?.alumni || 0}
              icon={GraduationCap}
            />
          </div>
          <div onClick={() => setSelected("JOBS")}>
            <Widget
              title="JOBS"
              total={totalsQuery.data?.student_alumni_with_jobs || 0}
              icon={LayoutDashboard}
            />
          </div>
          <div>
            <AlertDialog>
              <AlertDialogTrigger className="w-full text-left">
                <Widget
                  title="UPCOMING EVENTS"
                  total={totalsQuery.data?.upcomming_events || 0}
                  icon={ListChecks}
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will navigate you to events page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => redirectTo("/events")}>
                    Continue anyway
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col mt-5">
        {(() => {
          if (selected === "ALUMNI") return <AlumniTab />;
          if (selected === "STUDENTS") return <StudentTab />;
          if (selected === "JOBS") return <JobTab />;
          if (selected === "EVENTS") redirectTo("/events");
        })()}
      </div>
    </div>
  );
};

export default DashboardClient;
