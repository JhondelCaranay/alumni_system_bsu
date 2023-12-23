import React from 'react'
import ChatHeader from './ChatHeader'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'

const ChatBox = () => {
  return (
    <div className='flex flex-1 gap-x-3'>
        <div className='flex flex-col h-full bg-[#FFFFFF] rounded-xl flex-1'>
            <ChatHeader />
            <ChatBody />
            <ChatFooter />
        </div>
        {/* <div className='flex flex-col h-full bg-[#FFFFFF] rounded-xl w-full flex-[0.5]'>
        </div> */}
    </div>
  )
}

export default ChatBox