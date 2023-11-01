import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'

const JobSearch = () => {
  return (
    <div className="flex justify-center gap-x-3">
        <div className="flex items-center border-black border rounded-md px-2">
          <label htmlFor="job" className="text-sm font-semibold">What</label>
          <Input
            id="job"
            placeholder="Job title or company name"
            className="border-0 border-none hover:border-0 hover:border-none focus-visible:ring-0
                focus-visible:ring-offset-0"
          />
          <Search id="job" />
        </div>
        <Button variant={'default'} className="font-semibold">Find jobs</Button>
      </div>
  )
}

export default JobSearch