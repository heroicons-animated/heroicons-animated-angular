import { cva, type VariantProps } from "class-variance-authority";

import { mergeClasses } from "@/shared/utils/merge-classes";

export const buttonVariants = cva(
  mergeClasses(
    "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "rounded-lg border border-transparent bg-clip-padding aria-invalid:border-destructive dark:aria-invalid:border-destructive/50",
    "inline-flex items-center font-medium text-sm focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4",
    "justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
    "group/button shrink-0 select-none outline-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      zType: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      zSize: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)]",
        "icon-lg": "size-9",
      },
      zShape: {
        default: "rounded-md",
        circle: "rounded-full",
        square: "rounded-none",
      },
      zFull: {
        true: "w-full",
      },
      zLoading: {
        true: "pointer-events-none opacity-50",
      },
      zDisabled: {
        true: "pointer-events-none opacity-50",
      },
    },
    defaultVariants: {
      zType: "default",
      zSize: "default",
      zShape: "default",
    },
  }
);
export type ZardButtonShapeVariants = NonNullable<
  VariantProps<typeof buttonVariants>["zShape"]
>;
export type ZardButtonSizeVariants = NonNullable<
  VariantProps<typeof buttonVariants>["zSize"]
>;
export type ZardButtonTypeVariants = NonNullable<
  VariantProps<typeof buttonVariants>["zType"]
>;
