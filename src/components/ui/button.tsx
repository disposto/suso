import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-opacity disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-none focus-visible:border-primary",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:opacity-90",
        destructive:
          "bg-destructive text-white hover:opacity-90 dark:bg-destructive/60",
        outline:
          "border border-border bg-transparent hover:opacity-90",
        secondary:
          "bg-secondary text-secondary-foreground hover:opacity-90",
        ghost:
          "hover:opacity-80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-[8px] gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-[8px] px-6 has-[>svg]:px-4",
        icon: "size-9",
        sidebar: "h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
