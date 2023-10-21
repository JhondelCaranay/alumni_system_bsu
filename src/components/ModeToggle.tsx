import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    
  return (
    <div className="flex items-center space-x-2">
        <Label htmlFor="airplane-mode">Dark mode:</Label>
      <Switch id="airplane-mode" checked={theme === 'dark'} onCheckedChange={(checked) => {
        if(checked && theme !== 'dark') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
      }} />
    </div>
  )
}
