import React from 'react'
import Post from './Post'

const Feed = () => {
  return (
    <div className='flex-1 flex flex-col items-center gap-y-10'>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
    </div>
  )
}

export default Feed