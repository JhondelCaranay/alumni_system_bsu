import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useModal } from '@/hooks/useModalStore'
import { GuardianSchemaType } from '@/schema/guardian'
import { Archive, MoreHorizontal, Pencil, XSquare } from 'lucide-react'
import React from 'react'

type GuardianProps = {
  data:GuardianSchemaType
}
const Guardian:React.FC<GuardianProps> = ({data}) => {
  const {onOpen} = useModal()
  return (
    <div className='flex justify-between'>
              <div className='flex flex-col gap-y-1'>
                  <span className='font-semibold capitalize'>{data?.firstname} {data?.lastname}</span>
                  <span className='text-zinc-400 text-xs flex items-center capitalize'> {data?.relationship}</span>
                  <span className='text-zinc-400 text-xs flex items-center capitalize'> {data?.occupation}</span>
              </div>

              <DropdownMenu>
            <DropdownMenuTrigger className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-fit">
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
                onClick={() => onOpen('updateGuardian', {guardian: data})}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-100"
                onClick={() => onOpen('deleteGuardian', {guardian: data})}

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