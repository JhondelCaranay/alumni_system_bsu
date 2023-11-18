"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { DepartmentSchemaType } from "@/schema/department";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type DepartmentCheckboxProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function DepartmentCheckbox({
  value,
  setValue,
}: DepartmentCheckboxProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const departments = useQueryProcessor<DepartmentSchemaType[]>(
    "/departments",
    null,
    ["departments"]
  );


  if (departments.status === "error")
    return <span>Something went wrong...</span>;
  if (
    departments.status === "pending" ||
    departments.fetchStatus === "fetching"
  )
    return <Loader size={20} />;

    const selectableDepartments = departments.data.map((department) => ({
        label: department.name,
        value: department.id,
      }));


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-zinc-500 p-0 capitalize"
        >
          Select department
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search departments." />
          <CommandEmpty>No department found.</CommandEmpty>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem>
                    <CommandGroup className="">
                      {selectableDepartments.map((item) => (
                        <CommandItem>
                        <FormField
                          key={item.value}
                          control={form.control}
                          name="items"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
