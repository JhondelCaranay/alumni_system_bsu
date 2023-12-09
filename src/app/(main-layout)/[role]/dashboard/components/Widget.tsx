import { IconBadge } from "@/components/ui/icon-badge";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

type WidgetProps = {
  title: string;
  total: number;
  icon: LucideIcon;
};
const Widget = ({ title, total, icon }: WidgetProps) => {
  return (
    <div className="group hover:shadow-md hover:shadow-primary transition overflow-hidden border rounded-lg p-3 h-full cursor-pointer dark:shadow-none dark:bg-slate-900 dark:text-white">
      <div className="flex">
        <div className="flex flex-col gap-4">
          <div className="text-lg md:text-base font-extrabold group-hover:text-primary transition line-clamp-2 uppercase">
            {title}
            <Separator />
          </div>
          <p className="text-sm text-muted-foreground">{total}</p>
        </div>
        <div className="ml-auto self-end">
          <IconBadge icon={icon} size={"md"} variant={"default"} />
        </div>
      </div>
    </div>
  );
};
export default Widget;
