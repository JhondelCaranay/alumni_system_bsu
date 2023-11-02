"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./../components/Editor"), {
  ssr: false,
});

const page = () => {
  const router = useRouter()
  return (
    <div className="p-5">
      <Editor />
      <div className='flex justify-end mt-10 gap-x-3'>
      <Button variant={'outline'} onClick={() => router.push('/dashboard/jobs')}>Cancel</Button>
      <Button variant={'default'}>Post</Button>
      </div>
    </div>
  );
};

export default page;
