import { GetCurrentUserType } from '@/actions/getCurrentUser';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import React from 'react'
import Guardian from './Guardian';

type GuardiansInfoProps = {
  data: GetCurrentUserType;
};

const GuardiansInfo:React.FC<GuardiansInfoProps> = ({data}) => {
  return (
    <div className='flex flex-col bg-white dark:bg-[#1F2937] w-full p-5 rounded-lg gap-5'>
      <h1 className='text-3xl'>Family and relationships</h1>
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

export default GuardiansInfo