import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useModal } from '@/hooks/useModalStore'
import { GuardianSchemaType } from '@/schema/guardian'
import { Archive, MoreHorizontal, Pencil, XSquare } from 'lucide-react'
import React from 'react'

type GuardianProps = {
  data:GuardianSchemaType
}
const Guardian:React.FC<GuardianProps> = ({data}) => {
  return (
    <div className='flex justify-between'>
              <div className='flex flex-col gap-y-1'>
                  <span className='font-semibold capitalize'>{data?.firstname} {data?.lastname}</span>
                  <span className='text-zinc-400 text-xs flex items-center capitalize'> {data?.relationship}</span>
                  <span className='text-zinc-400 text-xs flex items-center capitalize'> {data?.occupation}</span>
              </div>
            </div>
  )
}

export default Guardian