"use client"
import React from 'react'
import ChatHeader from './ChatHeader'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'
import {useSearchParams} from "next/navigation"
import {MessageSquareDashed} from 'lucide-react'
import { useQueryProcessor } from '@/hooks/useTanstackQuery'
import { Loader } from '@/components/ui/loader'
import { GroupChatSchemaType } from '@/schema/groupchats'
import { User } from '@prisma/client'
const ChatBox = () => {

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const groupChat = useQueryProcessor< GroupChatSchemaType & {users: User[]}>(`/groupchats/${id}`, null, ['groupchats', id]);

  if(!id) {
    return <div className='flex flex-1 gap-x-3 bg-[#FFFFFF] rounded-xl'>
      <h1 className='text-zinc-500 text-md text-center w-full flex items-center justify-center gap-x-2'> <MessageSquareDashed className='w-10 h-10' /> <span>No chats selected</span>  </h1>
    </div>
  }

  if(groupChat.status === 'pending') {
    return <Loader size={30} />
  }


  if(groupChat.status === 'error') {
    return <div>Error fetching group chat</div>
  }

  return (
    <div className='flex flex-1 gap-x-3'>
        <div className='flex flex-col h-full bg-[#FFFFFF] rounded-xl flex-1'>
            <ChatHeader data={groupChat.data} />
            <ChatBody />
            <ChatFooter />
        </div>
    </div>
  )
}

export default ChatBox