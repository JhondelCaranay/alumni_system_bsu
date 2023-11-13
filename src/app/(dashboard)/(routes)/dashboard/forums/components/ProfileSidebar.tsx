import getCurrentUser from '@/actions/getCurrentUser'
import Avatar from '@/components/Avatar'
import { Mail, MapPin, Pin, Waypoints } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const ProfileSidebar = async () => {
    const user = await getCurrentUser()

    if(!user || !user.id) return redirect('/')

  return (
    <div className='flex-[0.5] flex flex-col w-full gap-y-5'>
        <div className='flex flex-col gap-y-1'>
            <Avatar src={user.image} className='h-[80px] w-[80px] rounded-md object-contain'/>
            <span className='font-semibold text-md text-black dark:text-white'>{user.name}</span>
        </div>
        <div className='flex flex-col gap-y-1'>
            <span className='flex text-sm gap-x-1 text-zinc-700 dark:text-zinc-400'><Waypoints className='h-4 w-4' /> {user.department?.name}</span>
            <span className='flex text-sm gap-x-1 text-zinc-700 dark:text-zinc-400'><MapPin  className='h-4 w-4 ' /> Philippines, {user.profile?.city}</span>
        </div>

        <div className='flex flex-col gap-y-1'>
            <label htmlFor="" className='text-md text-zinc-700 dark:text-zinc-400'>Email address</label>
            <span className='flex text-sm gap-x-1 text-black font-semibold  dark:text-white'> {user.email || user.profile?.alternative_email}</span>
        </div>

        <div className='flex flex-col gap-y-1'>
            <label htmlFor="" className='text-md text-zinc-700 dark:text-zinc-400'>Home address</label>
            <span className='flex text-sm gap-x-1 text-black font-semibold dark:text-white' >{user.profile?.province} {user.profile?.city} {user.profile?.street} {user.profile?.homeNo} {user.profile?.barangay}  </span>
        </div>

        <div className='flex flex-col gap-y-1'>
            <label htmlFor="" className='text-md text-zinc-700 dark:text-zinc-400'>Phone number</label>
            <span className='flex text-sm gap-x-1 text-black font-semibold  dark:text-white'>{user.profile?.contactNo} </span>
        </div>

    </div>
  )
}

export default ProfileSidebar