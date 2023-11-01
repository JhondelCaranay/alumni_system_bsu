import { Button } from '@/components/ui/button'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import React from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from 'query-string'
const JobPost = () => {

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const f = searchParams.get('f')
  const router = useRouter()
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          f: f ?? 1 ,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 cursor-pointer" onClick={onClick}>
            <div className="flex items-center space-x-4">
              <img
                className="w-7 h-7 rounded-full"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                alt="Jese Leos avatar"
              />
              <span className="font-medium dark:text-white">Jese Leos</span>
              <span className="text-sm">14 days ago</span>
            </div>
            <h2 className="my-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <a href="#">How to quickly deploy a static website</a>
            </h2>
            <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
              Static websites are now used to bootstrap lots of websites and are
              becoming the basis for a variety of tools that even influence both
              web designers and developers influence both web designers and
              developers.
            </p>

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