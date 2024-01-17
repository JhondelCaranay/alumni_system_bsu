"use client";

import {
  Briefcase,
  CalendarDays,
  Home,
  MessageCircle,
  TableProperties,
  Users,
} from "lucide-react";
import { MdHive } from "react-icons/md";
import { SidebarItem } from "./SidebarItem";
import { isUserAllowed } from "@/lib/utils";
import { Role } from "@prisma/client";
import { useSidebarModeStore } from "@/hooks/useSidebarModeStore";

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
    icon: TableProperties,
    label: "Section",
    href: "/sections",
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
    icon: MdHive,
    label: "CIT-zen",
    href: "/forums",
    roles: ["ADMIN", "ADVISER", "STUDENT", "ALUMNI"],
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
    roles: ["ADMIN", "ADVISER", "STUDENT", "ALUMNI"],
  },
  {
    icon: MessageCircle,
    label: "Message",
    href: "/messages",
    roles: ["ADMIN", "ADVISER", "STUDENT", "ALUMNI"],
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
  setOpen?: (open: boolean) => void;
};

export const SidebarRoutes = ({ role, setOpen }: SidebarRoutesProps) => {
  const { mode } = useSidebarModeStore();

  return (
    <div className="flex flex-col w-full ">
      {routesList.map((route) => {
        if (!isUserAllowed(role, route.roles)) {
          return null;
        }

        return (
          <SidebarItem
            mode={mode}
            key={route.href}
            icon={route.icon}
            label={route.label}
            setOpen={setOpen}
            href={`/${role.toLowerCase()}${route.href}`}
          />
        );
      })}
    </div>
  );
};
