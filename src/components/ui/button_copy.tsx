import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./lib/utils"



const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-slate-500 shadow-xs hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
        red: "bg-red-950 text-stone-100/90 shadow-xs hover:bg-red-950/90 dark:bg-red-950/60",
        lime: "bg-lime-950 text-stone-100/90 shadow-xs hover:bg-lime-950/90 dark:bg-lime-950/60",
        teal: "bg-teal-950 text-stone-100/90 shadow-xs hover:bg-teal-950/90 dark:bg-teal-950/60",
        sky: "bg-sky-950 text-stone-100/90 shadow-xs hover:bg-sky-950/90 dark:bg-sky-950/60",
        indigo: "bg-indigo-950 text-stone-100/90 shadow-xs hover:bg-indigo-950/90 dark:bg-indigo-950/60",
        purple: "bg-purple-950 text-stone-100/90 shadow-xs hover:bg-purple-950/90 dark:bg-purple-950/60",
        pink: "bg-pink-950 text-stone-100/90 shadow-xs hover:bg-pink-950/90 dark:bg-pink-950/60",
      },
      size: {
        sm: "h-6 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants>
{
  asChild?: boolean
}

function Button ({ className, variant, size, asChild = false, ...props }: ButtonProps)
{
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
