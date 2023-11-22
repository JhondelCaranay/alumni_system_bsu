"use client"
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import Guardian from './Guardian'
import { useModal } from '@/hooks/useModalStore'

const GuardianInfo = () => {
  const {onOpen} = useModal()
  return (
    <div className='flex flex-col  w-full p-5 rounded-lg gap-5 bg-white dark:bg-[#1F2937]'>
      <h1 className='text-3xl'>Family and relationships</h1>

      <Button variant={'link'} className='flex items-center gap-x-2 w-fit h-fit p-0 my-10' onClick={() => onOpen('createGuardian')}> 
        <PlusCircleIcon />
        Add a family/relationship
       </Button>
      {
        (() => {
          // if(typeof data?.profile?.parents === 'undefined' || data?.profile?.parents?.length <= 0) {
          //   return <div className='text-center'>No Guardians</div>
          // }
          
          return <section className='flex flex-col gap-y-5'>
            <Guardian />
            <Guardian />
          </section>
        })()
      }
    </div>
  )
}

export default GuardianInfo