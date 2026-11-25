import { MoonIcon, SunIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "@/hooks/use-theme"

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme()
  const label = theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={label}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
