import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useModal } from '@/hooks/useModalStore';
import { SafeDeparment, SafeUser, UserProfileWithDepartmentSection, UserWithProfile } from '@/types/types';
import { User } from '@prisma/client';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

type ActionButtonProps = {
  user: User | UserWithProfile | UserProfileWithDepartmentSection
}

const ActionButton:React.FC<ActionButtonProps> = ({user}) => {
  const { onOpen } = useModal();
  const router = useRouter()
  return (
    <div className={`h-full w-full cursor-pointer`}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="h-4 w-4 text-zinc-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-xs cursor-pointer hover:bg-zinc-400" onClick={() => router.push(`users/${user.id}`)}>
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer hover:bg-zinc-400"
                onClick={() => onOpen("archiveUser", { user: user })}
              >
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  )
}

export default ActionButton