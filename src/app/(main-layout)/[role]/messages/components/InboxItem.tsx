import { GroupChatSchemaType } from '@/schema/groupchats'
import React from 'react'
type InboxItemProps = {
  data: GroupChatSchemaType
}

const InboxItem:React.FC<InboxItemProps> = () => {
  return (
    <div className="flex max-h-[95px] overflow-hidden border border-x-0 border-t-0 border-b-1 p-2 gap-x-2">
            <div className="w-full flex justify-center items-center">
                <img
                    src={"/images/logo.png"}
                    className="w-12 h-12 object-contain m-auto"
                    alt="inbox item"
                    />
            </div>
          <div className="flex flex-col">
            <h2 className="text-[1.2em] font-semibold text-zinc-600">Kooapps Philippines Corporation</h2>
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