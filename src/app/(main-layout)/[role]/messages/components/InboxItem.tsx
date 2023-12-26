"use client"

import { GroupChatSchemaType } from '@/schema/groupchats'
import { useSearchParams, usePathname, useRouter} from 'next/navigation'
import React from 'react'
import qs from 'query-string'
type InboxItemProps = {
  data: GroupChatSchemaType
}

const InboxItem:React.FC<InboxItemProps> = ({data}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const f = searchParams?.get("f");
  const router = useRouter();

  const onClick = () => {
      const url = qs.stringifyUrl(
        {
          url: pathname || "",
          query: {
            id: data.id
          },
        },
        { skipNull: true }
      );

      router.push(url);
  };
  return (
    <div className="flex max-h-[95px] overflow-hidden border border-x-0 border-t-0 border-b-1 p-2 gap-x-2 cursor-pointer" onClick={onClick}>
            <div className="w-full flex justify-center items-center">
                <img
                    src={ data?.image || "/images/logo.png"}
                    className="w-12 h-12 object-cover m-auto rounded-full"
                    alt="inbox item"
                    />
            </div>
          <div className="flex flex-col">
            <h2 className="text-[1.2em] font-semibold text-zinc-600">{data.name}</h2>
            <p className="text-[0.9em] line-clamp-2 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
              iste perspiciatis dolorum, quasi odit commodi reiciendis sapiente
              ratione laudantium magni veritatis aliquam temporibus atque
              quibusdam voluptate nisi officia praesentium iusto laboriosam
              autem obcaecati quos nostrum? Magni ratione et non cupiditate, ex
              iusto officia! Ut maxime earum consectetur id minima sunt?
            </p>
          </div>
        </div>
  )
}

export default InboxItem