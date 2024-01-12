"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSidebarModeStore } from "@/hooks/useSidebarModeStore";
import { cn } from "@/lib/utils";

export function SidebarModeSwitch() {
  const { mode, setMode } = useSidebarModeStore();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="airplane-mode">Icon only:</Label>
      <Switch
        id="airplane-mode"
        checked={mode === "mini"}
        onCheckedChange={(checked) => {
          if (checked && mode !== "mini") {
            setMode("mini");
          } else {
            setMode("normal");
          }
        }}
      />
    </div>
  );
}
