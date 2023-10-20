"use client";

import {
  BarChart,
  Briefcase,
  CalendarDays,
  Compass,
  GraduationCap,
  Home,
  Layout,
  List,
  MessageSquare,
  MessagesSquare,
  Table,
  TableProperties,
  Users,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";

const routesList = [
  {
    icon: Home,
    label: "Home",
    href: "/dashboard",
  },
  {
    icon: TableProperties,
    label: "Course",
    href: "/dashboard/courses",
  },
  {
    icon: GraduationCap,
    label: "Alumni",
    href: "/dashboard/alumni",
  },
  {
    icon: Users,
    label: "Students",
    href: "/dashboard/students",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    href: "/dashboard/jobs",
  },
  {
    icon: CalendarDays,
    label: "Events",
    href: "/dashboard/events",
  },
  {
    icon: MessagesSquare,
    label: "Forum",
    href: "/dashboard/forums",
  },
  {
    icon: Users,
    label: "Users",
    href: "/dashboard/users",
  },
];

export const SidebarRoutes = () => {
  const routes = routesList;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
      ))}
    </div>
  );
};