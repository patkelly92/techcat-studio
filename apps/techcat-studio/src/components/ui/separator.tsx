"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-gray-200 dark:bg-zinc-800 h-px w-full", className)}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator }
