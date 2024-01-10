import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SafeUser } from "@/types/types";
import Avatar from "./Avatar";
import { ModeToggle } from "./ModeToggle";
import { signOut } from "next-auth/react";
import { capitalizeWords } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import Link from "next/link";
import { format } from "timeago.js";
import useRouterPush from "@/hooks/useRouterPush";
import { NotificationType } from "@prisma/client";

type UserNotificationProps = {
  currentUser?: GetCurrentUserType | null;
};
const UserNotification = ({ currentUser }: UserNotificationProps) => {
  const router = useRouter();
  const { redirectTo } = useRouterPush();
  const unreadMessages =
    currentUser?.notifications.reduce(
      (currentTotal, notification) =>
        !notification.isRead ? currentTotal + 1 : currentTotal,
      0
    ) || 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mr-10">
        <Button variant={"ghost"} size={"icon"} className="relative">
          {unreadMessages > 0 && (
            <span className=" flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-sm absolute top-0 right-0">
              {unreadMessages}
            </span>
          )}

          <Bell className="relative w-5 h-5 fill-orange-300 text-orange-300 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <h1 className="text-sm text-center">Notifications</h1>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {currentUser?.notifications.map((notification) => (
          <div
            className="flex p-3 cursor-pointer hover:bg-zinc-200 rounded-md z-50 gap-x-3"
            onClick={() => {
              if (notification.type === NotificationType.POST_LIKE) {
                redirectTo(`forums/${notification.postId}`);
              }

              if (notification.type === NotificationType.COMMENT_ON_POST) {
                //
              }
            }}
          >
            <Avatar
              src={
                notification.usersWhoInteract[
                  notification.usersWhoInteract.length - 1
                ].image
              }
            />
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-500">
                {notification.content}
              </span>
              <time className="text-sm text-zinc-500 mt-2">
                {format(new Date(notification.updatedAt))}
              </time>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserNotification;
