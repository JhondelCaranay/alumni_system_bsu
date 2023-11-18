import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Archive, MoreHorizontal, Pencil, PlusCircleIcon, XSquare } from 'lucide-react';

const Guardian = () => {
  return (
    <div className='flex justify-between'>
              <div className='flex flex-col gap-y-1'>
                  <span className='font-semibold'>{'John Doe'}</span>
                  <span className='text-zinc-400 text-xs flex items-center'> {'Father'}</span>
                  <span className='text-zinc-400 text-xs flex items-center'> {'Graphic Designer'}</span>
              </div>

              <DropdownMenu>
            <DropdownMenuTrigger className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <MoreHorizontal className="h-6 w-6 text-zinc-400 " />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              <DropdownMenuItem
                className="text-xs cursor-pointer hover:bg-zinc-400 md:hidden"
              >
                <XSquare className="h-4 w-4 mr-2" />
                Close
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer hover:bg-zinc-400"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
              >
                <Archive className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
            </div>
  )
}

export default Guardian