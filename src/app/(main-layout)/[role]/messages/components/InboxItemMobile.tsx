"use client";

import { GroupChatSchemaType } from "@/schema/groupchats";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import qs from "query-string";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { cn } from "@/lib/utils";
import Avatar from "@/components/Avatar";

type InboxItemProps = {
  data: GroupChatSchemaType & { messages: GroupChatMessageSchemaType[] };
};

const InboxItemMobile: React.FC<InboxItemProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const id = searchParams?.get("id");
  const router = useRouter();

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          id: data.id,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div
      className={cn(
        "flex max-h-[95px] overflow-hidden border border-x-0 border-t-0 border-b-1 p-2 gap-x-2 cursor-pointer",
        id === data?.id && "bg-zinc-100 dark:bg-slate-800 "
      )}
      onClick={onClick}
    >
      <div className=" flex justify-center items-center">
        <Avatar
          src={data?.image || "/images/logo.png"}
          className="w-12 h-12 object-cover m-auto rounded-full"
        />
      </div>
    </div>
  );
};

export default InboxItemMobile;
