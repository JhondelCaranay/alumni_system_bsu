import React from 'react'
import Post from './Post'
import CreateFeedInput from './CreateFeedInput'

const Feed = () => {
  return (
    <div className='flex-1 flex flex-col items-center gap-y-5 max-h-[87vh] overflow-y-auto px-10'>
      <CreateFeedInput />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
    </div>
  )
}

export default Feed