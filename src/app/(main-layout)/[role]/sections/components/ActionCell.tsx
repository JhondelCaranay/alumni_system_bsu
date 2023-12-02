import UpdateSectionModal from "@/components/modals/section/UpdateSectionModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SectionSchemaType } from "@/schema/section";
import { Archive, Copy, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  data: SectionSchemaType;
};
const ActionCell = ({ data }: Props) => {
  const [isOpen, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Section ID copied to clipboard.");
  };

  return (
    <>
      {isOpen ? (
        <UpdateSectionModal
          section={data}
          isOpen={isOpen}
          onClose={() => setOpen(false)}
        />
      ) : null}

      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onCopy(data.id)}>
              <Copy className="mr-2 h-4 w-4" /> Copy Id
            </DropdownMenuItem>
            {/* <Link href={`/sections/${data.id}/view`}>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
            </Link> */}
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-100">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
export default ActionCell;
