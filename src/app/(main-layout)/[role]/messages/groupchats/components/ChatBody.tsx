"use client"
import React, { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import { useQueryProcessor } from '@/hooks/useTanstackQuery'
import { useParams, useSearchParams } from 'next/navigation'
import { GroupChatMessageSchemaType } from '@/schema/groupchat-message'
import { GetCurrentUserType } from '@/actions/getCurrentUser'
import { useChatSocket } from '@/hooks/useChatSocket'
import { UserWithProfile } from '@/types/types'
import { Hash } from 'lucide-react'

type ChatBodyProps = {
  currentUser:GetCurrentUserType
}

const ChatBody:React.FC<ChatBodyProps> = ({currentUser}) => {
  const params = useParams()
  const groupchatId = params?.groupchatId
  const messagesQueryKey = [`groupchat`, groupchatId, 'messages']
  const chatKey = `chats:${groupchatId}:messages`
  const chatbodyRef = useRef<HTMLDivElement>(null);
  const messages = useQueryProcessor<(GroupChatMessageSchemaType & {sender: UserWithProfile})[]>(`/groupchat/${groupchatId}/messages`, null, messagesQueryKey)
  
  useEffect(() => {
    messages.refetch()
  }, [])
  
  useChatSocket({
    chatKey: chatKey,
    queryKey: messagesQueryKey
  })

  useEffect(() => {
    if(chatbodyRef.current) {
      chatbodyRef.current.scrollTop = chatbodyRef.current?.scrollHeight
    }
  }, [messages])
  
  return (
    <div className='flex flex-col h-full w-full p-5 gap-y-5 overflow-x-hidden overflow-y-auto' id="chatbody" ref={chatbodyRef}>

      <h1 className='text-center text-zinc-500 flex items-center text-sm font-normal self-center'> <Hash className='text-zinc-500 h-4 w-4' /> This is the start of your group chat conversation</h1>
      {
        messages.data?.map((message) => (
            <ChatMessage data={message} currentUser={currentUser} key={message.id} />
        ))
      }
    </div>
  )
}

export default ChatBody