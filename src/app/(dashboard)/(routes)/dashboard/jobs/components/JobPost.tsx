"use client"
import { Button } from '@/components/ui/button'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from 'query-string'
import { SafeUser } from '@/types/types';
import { CommentSchemaType } from '@/schema/comment';
import { PostSchemaType } from '@/schema/post';
import { format } from "date-fns";
import Avatar from '@/components/Avatar';
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import dynamic from 'next/dynamic';

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

type JobPostProps = {
  post: PostSchemaType;
  user: SafeUser;
  comments: CommentSchemaType & {
    user: SafeUser
  }
}

const DATE_FORMAT = `d MMM yyyy, HH:mm`;

const JobPost:React.FC<JobPostProps> = ({user,comments, post}) => {

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const f = searchParams.get('f')
  const router = useRouter()

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          f: post.id ,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };


  return (
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 cursor-pointer" onClick={onClick}>
            <div className="flex items-center space-x-4">
              <Avatar
                className="w-7 h-7 rounded-full"
                src={user.image}
              />
              <span className="font-medium dark:text-white">{user.name}</span>
              <span className="text-sm">{format(new Date(post.createdAt), DATE_FORMAT)}</span>
            </div>

            <div className='my-5 max-h-[350px] overflow-hidden truncate'>
              <FroalaEditorView model={post.description} />
            </div>
            <div className="flex justify-end">
              <Button variant={"ghost"} size={"icon"}>
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant={"ghost"} size={"icon"}>
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button variant={"ghost"} size={"icon"}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </article>
  )
}

export default JobPost