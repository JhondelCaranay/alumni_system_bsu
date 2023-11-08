import React from 'react'
import ProfileSidebar from './ProfileSidebar'
import Feed from './Feed'
import OtherSidebar from './OtherSidebar'

const ForumsClient = () => {
  return (
    <div className='flex justify-evenly bg-[#F9FAFB] w-full p-10'>
        <ProfileSidebar />
        <Feed />
        <OtherSidebar />
    </div>
  )
}

export default ForumsClient