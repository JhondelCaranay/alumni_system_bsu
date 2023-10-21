"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ModalType, useModal } from '@/hooks/useModalStore'
import { query } from '@/lib/tanstack-query-processor'
import { Search, UserPlus,File} from 'lucide-react'
import React from 'react'

type StudentSearchProps = {
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}
const StudentSearch:React.FC<StudentSearchProps> = ({onChange}) => {
 
  const {data, isLoading} = query('/departments', {}, ['deparments'], {}, {})

    const {onOpen} = useModal()
    const onModalOpen = (type: ModalType) => {
      console.log(type)
      onOpen(type, {});
    }

    if(isLoading) return <div>loading...</div>
    
  return (
    <div className="flex items-center gap-5 my-10">
        <div className="border flex items-center rounded-md px-2 flex-1">
          <Search className="w-5 h-5 text-zinc-400" />
          <Input className="inset-0 outline-none border-none active:outline-none hover:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" onChange={onChange} type="text" placeholder="Search for studentNo, email, course or something..." />
        </div>
        <Button className="bg-[#0369A1] hover:bg-[#034da1] text-sm"> <UserPlus className="w-5 h-5 mr-2" /> Create student</Button>
        <Button className="bg-[#0369A1] hover:bg-[#034da1] text-sm" onClick={() => onModalOpen('importStudents')}> <File className="w-5 h-5 mr-2" /> Import students</Button>
      </div>
  )
}

export default StudentSearch