"use client";

import {
  Bell,
  Briefcase,
  CalendarDays,
  UserCircle,
  Home,
  MessageCircle,
  TableProperties,
  Users,
  Megaphone,
} from "lucide-react";
import { MdHive } from "react-icons/md";
import { SidebarItem } from "./SidebarItem";
import { isUserAllowed } from "@/lib/utils";
import { Role } from "@prisma/client";

type routeListType = {
  icon: any;
  label: string;
  href: string;
  roles: ("ALL" | Role)[];
};

const routesList: routeListType[] = [
  {
    icon: Home,
    label: "Home",
    href: "/dashboard",
    roles: ["ADMIN"],
  },

  {
    icon: TableProperties,
    label: "Course",
    href: "/courses",
    roles: ["ADMIN"],
  },
  {
    icon: Users,
    label: "Alumni / Students",
    href: "/students",
    roles: ["ADMIN"],
  },
  {
    icon: Users,
    label: "Users",
    href: "/users",
    roles: ["ADMIN"],
  },
  {
    icon: Briefcase,
    label: "Jobs",
    href: "/jobs",
    roles: ["ALL"],
  },
  {
    icon: CalendarDays,
    label: "Events",
    href: "/events",
    roles: ["ALL"],
  },
  {
    icon: MdHive,
    label: "CitZen",
    href: "/forums",
    roles: ["ALL"],
  },
  {
    icon: MessageCircle,
    label: "Message",
    href: "/message",
    roles: ["ALL"],
  },
  // {
  //   icon: Bell,
  //   label: "Notifications",
  //   href: "/notifications",
  //   roles: ["ALL"],
  // },
  // {
  //   icon: Megaphone,
  //   label: "Anoucement",
  //   href: "/anoucement",
  //   roles: ["ALL"],
  // },
];

type SidebarRoutesProps = {
  role: string;
};

export const SidebarRoutes = ({ role }: SidebarRoutesProps) => {
  // const routes = routesList;

  return (
    <div className="flex flex-col w-full ">
      {routesList.map((route) => {
        if (!isUserAllowed(role, route.roles)) {
          return null;
        }

        return (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={`/${role.toLowerCase()}${route.href}`}
          />
        );
      })}
    </div>
  );
};
