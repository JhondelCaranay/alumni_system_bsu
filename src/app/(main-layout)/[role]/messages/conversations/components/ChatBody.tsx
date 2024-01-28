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
import { DirectMessageSchemaType } from '@/schema/direct-message'
import { useConversationChatSocket } from '@/hooks/useConversationChatSocket'

type ChatBodyProps = {
  currentUser:GetCurrentUserType
}

const ChatBody:React.FC<ChatBodyProps> = ({currentUser}) => {
  const params = useParams()
  const conversationId = params?.conversationId
  const messagesQueryKey = [`conversations`, conversationId, 'messages']
  const chatKey = `chats-conversation:${conversationId}:messages`
  const chatbodyRef = useRef<HTMLDivElement>(null);
  const messages = useQueryProcessor<(DirectMessageSchemaType & {sender: UserWithProfile})[]>(`/conversations/${conversationId}/messages`, null, messagesQueryKey)
  
  useConversationChatSocket({
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