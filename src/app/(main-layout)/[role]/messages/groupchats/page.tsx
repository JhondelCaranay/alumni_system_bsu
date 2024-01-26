import { MessageSquareDashed } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-1 gap-x-3 bg-[#FFFFFF] rounded-xl dark:bg-slate-900 h-full">
        <h1 className="text-zinc-500 text-center w-full flex items-center justify-center gap-x-2 text-sm md:text-md">
          {" "}
          <MessageSquareDashed className="w-10 h-10" />{" "}
          <span>No chats selected</span>{" "}
        </h1>
      </div>
  )
}

export default page