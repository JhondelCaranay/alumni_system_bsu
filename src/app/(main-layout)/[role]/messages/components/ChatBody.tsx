"use client"
import React from 'react'
import ChatMessage from './ChatMessage'
import { useQueryProcessor } from '@/hooks/useTanstackQuery'
import { useSearchParams } from 'next/navigation'
import { GroupChatMessageSchemaType } from '@/schema/groupchat-message'
import { GetCurrentUserType } from '@/actions/getCurrentUser'
import { useChatSocket } from '@/hooks/useChatSocket'
import { UserWithProfile } from '@/types/types'

type ChatBodyProps = {
  currentUser:GetCurrentUserType
}

const ChatBody:React.FC<ChatBodyProps> = ({currentUser}) => {
  const searchParams = useSearchParams()
  const groupchatId = searchParams?.get('id')
  const messagesQueryKey = [`groupchat`, groupchatId, 'messages']
  const chatKey = `chats:${groupchatId}:messages`

  const messages = useQueryProcessor<(GroupChatMessageSchemaType & {sender: UserWithProfile})[]>(`/groupchat/${groupchatId}/messages`, null, messagesQueryKey)

  useChatSocket({
    chatKey: chatKey,
    queryKey: messagesQueryKey
  })
  
  return (
    <div className='flex flex-col h-full w-full p-5 gap-y-5 overflow-x-hidden overflow-y-auto'>
      {
        messages.data?.map((message) => (
            <ChatMessage data={message} currentUser={currentUser} key={message.id} />
        ))
      }
    </div>
  )
}

export default ChatBody