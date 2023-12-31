import ArchiveDepartmentModal from "@/components/modals/department/ArchiveDepartmentModal";
import UpdateDepartmentModal from "@/components/modals/department/UpdateDepartmentModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DepartmentSchemaType } from "@/schema/department";
import { Archive, Copy, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  data: DepartmentSchemaType;
};
const ActionCell = ({ data }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [isArchiveModalOpen, setArchiveModalOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Department ID copied to clipboard.");
  };

  return (
    <div className="flex justify-end">
      {isOpen ? (
        <UpdateDepartmentModal
          department={data}
          isOpen={isOpen}
          onClose={() => setOpen(false)}
        />
      ) : null}
      {isArchiveModalOpen ? (
        <ArchiveDepartmentModal
          department={data}
          isOpen={isArchiveModalOpen}
          onClose={() => setArchiveModalOpen(false)}
        />
      ) : null}
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
          {/* <Link href={`/departments/${data.id}/view`}>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
            </Link> */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setArchiveModalOpen(true)}
            className="text-red-600 hover:!text-red-600 hover:!bg-red-100 "
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ActionCell;
