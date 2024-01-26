"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import InboxItem from "./groupchat/InboxGroupchatItem";
import { Filter, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { GroupChatSchemaType } from "@/schema/groupchats";
import { Loader2 } from "@/components/ui/loader";
import { GroupChatMessageSchemaType } from "@/schema/groupchat-message";
import { Role } from "@prisma/client";
import InboxGroupchatItemMobile from "./groupchat/InboxGroupchatItemMobile";
import { Hint } from "@/components/hint";
import useRouterPush from "@/hooks/useRouterPush";
import InboxGroupchatMobile from "./groupchat/InboxGroupchatMobile";
import { usePathname } from "next/navigation";

type Props = {
  currentUser: GetCurrentUserType;
};

const InboxMobile = ({ currentUser }: Props) => {
  
  
  const {redirectTo} = useRouterPush()

  const onSelect = (page:string) => {
    redirectTo(`messages/${page}`)
}
const pathname = usePathname()
  const { onOpen } = useModal();
  return (
    <div className="flex md:hidden flex-col h-full w-[70px] bg-[#FFFFFF] rounded-xl dark:bg-slate-900 overflow-auto">
      <div className="w-full flex flex-col justify-center p-1 pt-3 gap-y-2 border border-x-0 border-t-0 border-b-1">
        <div className="flex items-center justify-center">
          {(currentUser?.role === Role.ADMIN ||
            currentUser?.role === Role.ADVISER) && (
            <Hint label={"Create group chat"} side="right">
              <Plus
                className="h-10 w-10 cursor-pointer bg-white text-black rounded-full"
                onClick={() => onOpen("createGroupChat", { user: currentUser })}
              />
            </Hint>
          )}
        </div>

        <div className="flex items-center justify-center">
          <Select onValueChange={(e) => onSelect(e)}>
            <Hint label={"Filter"} side="right" asChild>
              <SelectTrigger className="w-12 h-12 text-xs rounded-full">
                <Filter className="w-10 h-10" />
              </SelectTrigger>
            </Hint>
            <SelectContent>
              <SelectGroup>
              <SelectItem value="groupchats" >Groupchat</SelectItem>
              <SelectItem value="conversations">Conversations</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {
        (() => {
          if(pathname?.includes('groupchats'))
          return <InboxGroupchatMobile currentUser={currentUser}/>

          if(pathname?.includes('conversations'))
          return null
        })()
      }
    </div>
  );
};
export default InboxMobile;
