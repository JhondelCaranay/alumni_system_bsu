"use client"
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useMutateProcessor } from '@/hooks/useTanstackQuery';
import { CreatePostSchemaType, PostSchemaType } from '@/schema/post';
import toast from 'react-hot-toast';
import { Lightbulb } from 'lucide-react';
// import Editor from '../components/Editor'
const Editor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

const PostAJobPage = () => {

  const [model, setModel] = useState('');

  const router = useRouter()

  const createJob = useMutateProcessor<CreatePostSchemaType, PostSchemaType>(`/posts`, null, 'POST', ['jobs']);

  const onPost = () => {
    if(model !== '') {
      createJob.mutate({description: model, type: 'JOBS'}, {
        onSuccess(data, variables, context) {
          localStorage.removeItem('savedContent')
          toast.success('Job has been uploaded.');

            router.push('/dashboard/jobs')
        },
      })
    }
  }
  const onCancel = () => {
    localStorage.removeItem('savedContent')
    router.push('/dashboard/jobs')
  }

  useEffect(() => {
    const savedContent = localStorage.getItem("savedContent");
    if(savedContent) {
      setModel( savedContent)
    }

    return () => {
      localStorage.removeItem('savedContent')
    }
  }, [])
  

  return (
    <div className="p-5">
      <div className="flex items-center bg-[rgb(237,243,248)] my-10 rounded-md p-5">
        <Lightbulb className="text-[rgb(195,125,22)]" />{" "}
        <h1 className=" text-zinc-500 text-sm">
          {" "}
          Create a high quality job post, to learn more
          <kbd className="mx-2">
            <span className="bg-zinc-200 p-2 rounded-md text-xs">Ctrl + /</span>
          </kbd>
          while you focus on the text editor.
        </h1>
      </div>

      <Editor model={model} onChange={(value) => setModel(value)} />

      <div className='flex justify-end mt-10 gap-x-3'>
        <Button variant={'outline'} onClick={onCancel}>Cancel</Button>
        <Button variant={'default'} onClick={onPost}>Post</Button>
      </div>
    </div>
  );
};

export default PostAJobPage;
