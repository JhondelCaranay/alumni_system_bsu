"use client"
import { Button } from '@/components/ui/button'
import { PlusCircleIcon, UserX } from 'lucide-react'
import React from 'react'
import Guardian from './Guardian'
import { useModal } from '@/hooks/useModalStore'
import { GetCurrentUserType } from '@/actions/getCurrentUser'
import { useQueryProcessor } from '@/hooks/useTanstackQuery'
import { GuardianSchemaType } from '@/schema/guardian'
import { Loader } from '@/components/ui/loader'

type GuardianInfoProps = {
  data: GetCurrentUserType;
};

const GuardianInfo:React.FC<GuardianInfoProps> = ({data}) => {
  const {onOpen} = useModal()

  const guardians = useQueryProcessor<GuardianSchemaType[]>('/guardians', null, ['guardians'])

  return (
    <div className='flex flex-col  w-full p-5 rounded-lg gap-5 bg-white dark:bg-[#1F2937]'>
      <h1 className='text-3xl'>Family and relationships</h1>

      <Button variant={'link'} className='flex items-center gap-x-2 w-fit h-fit p-0 my-10' onClick={() => onOpen('createGuardian', {user: data})}> 
        <PlusCircleIcon />
        Add a family/relationship
       </Button>
      {
        (() => {

          if(guardians.status === 'pending' || guardians.isFetching) {
            return <Loader size={30} />
          }

          if(typeof guardians.data === 'undefined' || guardians.data.length <= 0) {
            return <div className='text-center gap-x-2 flex items-center justify-center text-zinc-500'> <UserX /> No Guardians</div>
          }
          
          return <section className='flex flex-col gap-y-5'>
            {
              guardians.data.map((guardian) => (
                <Guardian data={guardian} />
              ))
            }
          </section>
        })()
      }
    </div>
  )
}

export default GuardianInfo