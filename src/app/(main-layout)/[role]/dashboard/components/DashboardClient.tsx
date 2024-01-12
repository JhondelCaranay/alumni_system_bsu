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

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type DashboardClientProps = {
  tab: string;
};

const DashboardClient = ({ tab = "students" }: DashboardClientProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const dashboardTotalsQuery = useQuery({
    queryKey: ["dashboard-totals"],
    queryFn: getDashboardWidget,
  });

  const { redirectTo } = useRouterPush();

  const handleSelectedTab = (tab: string) => {
    if (searchParams) {
      let currentQueries = qs.parse(searchParams.toString());
      const newQueries = { ...currentQueries, tab: tab };

      const newParams = qs.stringify(newQueries, {
        skipEmptyString: true,
        skipNull: true,
      });

      replace(`${pathname}?${newParams}`);
    }
  };

  return (
    <div className="p-6">
      {dashboardTotalsQuery.data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div onClick={() => handleSelectedTab("students")}>
            <Widget
              title="STUDENTS"
              total={dashboardTotalsQuery.data?.students || 0}
              icon={LucideUserSquare2}
            />
          </div>
          <div onClick={() => handleSelectedTab("alumni")}>
            <Widget
              title="ALUMNI"
              total={dashboardTotalsQuery.data?.alumni || 0}
              icon={GraduationCap}
            />
          </div>
          <div onClick={() => handleSelectedTab("jobs")}>
            <Widget
              title="JOBS"
              total={dashboardTotalsQuery.data?.student_alumni_with_jobs || 0}
              icon={LayoutDashboard}
            />
          </div>
          <div>
            <AlertDialog>
              <AlertDialogTrigger className="w-full text-left">
                <Widget
                  title="UPCOMING EVENTS"
                  total={dashboardTotalsQuery.data?.upcomming_events || 0}
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
          if (tab === "alumni") return <AlumniTab />;
          if (tab === "students") return <StudentTab />;
          if (tab === "jobs") return <JobTab />;
          if (tab === "event") redirectTo("/events");
        })()}
      </div>
    </div>
  );
};

export default DashboardClient;
