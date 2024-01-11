import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { format } from "timeago.js";
import useRouterPush from "@/hooks/useRouterPush";
import {
  Comment,
  Like,
  Notification,
  NotificationType,
  Post,
  User,
} from "@prisma/client";
import { apiClient, useQueryProcessor } from "@/hooks/useTanstackQuery";
import { SafeUser, UserWithProfile } from "@/types/types";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type UserNotificationProps = {
  currentUser?: GetCurrentUserType | null;
};
const UserNotification = ({ currentUser }: UserNotificationProps) => {
  const { redirectTo } = useRouterPush();
  const notifications = useQueryProcessor<
    (Notification & {
      post: Post;
      usersWhoInteract: User[];
      comment: Comment;
      like: Like;
      user: UserWithProfile;
    })[]
  >("/notifications", null, ["notifications"]);

    const unreadMessagesCount =  notifications?.data?.reduce((currentTotal, notification) => notification.isRead == false ? currentTotal + 1 : currentTotal,0) || 0

  useNotificationSocket({
    notificationCreateKey: `notification:${currentUser?.id}:create`,
    notificationUpdateKey: `notification:${currentUser?.id}:update`,
    queryKey: ["notifications"],
  });
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mr-10">
        <Button variant={"ghost"} size={"icon"} className="relative">
          {unreadMessagesCount > 0 && (
            <span className=" flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-sm absolute top-0 right-0">
              {unreadMessagesCount}
            </span>
          )}

          <Bell className="relative w-5 h-5 fill-orange-300 text-orange-300 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className=" max-w-[300px] md:max-w-[412px]">
        <DropdownMenuLabel>
          <h1 className="text-sm text-center">Notifications</h1>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications?.data?.map((notification) => (
          <div
            className={cn(" flex p-3 cursor-pointer hover:bg-zinc-200 rounded-md z-50 gap-x-3 bg-zinc-200 m-1 dark:bg-[#101627] ", notification.isRead && 'bg-white dark:bg-[#020817]')}
            key={notification.id}
            onClick={async () => {
              if (notification?.type === NotificationType.POST_LIKE) {
                if (notification.post?.type === "FEED") {
                  redirectTo(`forums/${notification?.post.id}`);
                } else {
                  redirectTo(`jobs/${notification?.post.id}/view`);
                }
              }

              if (notification?.type === NotificationType.COMMENT_ON_POST || notification?.type === NotificationType.REPLY_TO_COMMENT) {
                if (notification.post?.type === "FEED") {
                  redirectTo(`forums/${notification?.post.id}#${notification.comment.id}`);
                } else {
                  redirectTo(`jobs/${notification?.post?.id}/view#${notification.comment.id}`);
                }
              }

              await apiClient.patch(`/notifications/${notification.id}`, {isRead:true})
              notifications.refetch()
            }}
          >
            <Avatar
              src={
                notification?.usersWhoInteract[
                  notification?.usersWhoInteract?.length - 1
                ]?.image
              }
            />
            <div className="flex flex-col">
              <span className="sm:text-sm font-semibold text-zinc-500 line-clamp-2">
                {notification.content}
              </span>
              <time className="text-sm text-zinc-500 mt-2">
                {format(new Date(notification.createdAt))}
              </time>
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserNotification;
