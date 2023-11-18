"use client";

import {
  Briefcase,
  CalendarDays,
  Home,
  MessagesSquare,
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
    href: "/courses",
  },
  {
    icon: Users,
    label: "Alumni / Students",
    href: "/students",
  },
  {
    icon: Briefcase,
    label: "Jobs",
    href: "/jobs",
  },
  {
    icon: CalendarDays,
    label: "Events",
    href: "/events",
  },
  {
    icon: MessagesSquare,
    label: "Forum",
    href: "/forums",
  },
  {
    icon: Users,
    label: "Users",
    href: "/users",
  },
];

type SidebarRoutesProps = {
  role: string;
};

export const SidebarRoutes = ({ role }: SidebarRoutesProps) => {
  const routes = routesList;

  return (
    <div className="flex flex-col w-full ">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={`/${role}${route.href}`}
        />
      ))}
    </div>
  );
};
