import React from 'react'
import ChatMessage from './ChatMessage'

const ChatBody = () => {
  return (
    <div className='flex flex-col h-full w-full p-5 gap-y-5 overflow-x-hidden overflow-y-auto'>
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
    </div>
  )
}

export default ChatBody