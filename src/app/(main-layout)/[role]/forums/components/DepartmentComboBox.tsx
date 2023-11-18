"use client"
 
import React, { useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useQueryProcessor } from "@/hooks/useTanstackQuery"
import { Loader } from "@/components/ui/loader"
import { DepartmentSchemaType } from "@/schema/department"


  type DepartmentComboBoxProps = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  }
   
  export default function DepartmentComboBox({value, setValue}: DepartmentComboBoxProps) {
    const [open, setOpen] = React.useState(false)

    const departments = useQueryProcessor<DepartmentSchemaType[]>('/departments',null, ['departments'])

    if(departments.status === 'error') return <span>Something went wrong...</span>
    if(departments.status === 'pending' || departments.fetchStatus === 'fetching') return <Loader size={20} />
   
    const selectableDepartments = departments.data.map((department) => ({
      label: department.name,
      value: department.id
    }))

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="link"
            role="combobox"
            aria-expanded={open}
            className="justify-between text-zinc-500 p-0 capitalize"
          >
            {value
              ? selectableDepartments.find((department) => department.value === value)?.label.toLowerCase()
              : 'Public'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search departments." />
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {selectableDepartments.map((d) => (
                <CommandItem
                  key={d.value}
                  value={d.value}
                  className="capitalize"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === d.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {d.label.toLowerCase()}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }