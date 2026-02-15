import { cva, type VariantProps } from "class-variance-authority";

export const toastVariants = cva(
  "group toast group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg",
  {
    variants: {
      variant: {
        default:
          "group-[.toaster]:bg-background group-[.toaster]:text-foreground",
        destructive:
          "destructive group-[.toaster]:border-destructive group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type ZardToastVariants = VariantProps<typeof toastVariants>;
