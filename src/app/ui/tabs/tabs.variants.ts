import { cva, type VariantProps } from "class-variance-authority";

import type { zAlign } from "./tabs.component";

export const tabContainerVariants = cva("flex", {
  variants: {
    zPosition: {
      top: "flex-col",
      bottom: "flex-col",
      left: "flex-row",
      right: "flex-row",
    },
  },
  defaultVariants: {
    zPosition: "top",
  },
});

export const tabNavVariants = cva(
  "scroll nav-tab-scroll flex gap-4 overflow-auto",
  {
    variants: {
      zPosition: {
        top: "mb-4 flex-row border-b",
        bottom: "mt-4 flex-row border-t",
        left: "mr-4 min-h-0 flex-col border-r",
        right: "ml-4 min-h-0 flex-col border-l",
      },
      zAlignTabs: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },
    },
    defaultVariants: {
      zPosition: "top",
      zAlignTabs: "start",
    },
  }
);

export const tabButtonVariants = cva(
  "flex-shrink-0 rounded-none hover:bg-transparent",
  {
    variants: {
      zActivePosition: {
        top: "",
        bottom: "",
        left: "",
        right: "",
      },
      isActive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        zActivePosition: "top",
        isActive: true,
        class: "border-t-2 border-t-primary",
      },
      {
        zActivePosition: "bottom",
        isActive: true,
        class: "border-b-2 border-b-primary",
      },
      {
        zActivePosition: "left",
        isActive: true,
        class: "border-l-2 border-l-primary",
      },
      {
        zActivePosition: "right",
        isActive: true,
        class: "border-r-2 border-r-primary",
      },
    ],
    defaultVariants: {
      zActivePosition: "bottom",
      isActive: false,
    },
  }
);

export type ZardTabVariants = VariantProps<typeof tabContainerVariants> &
  VariantProps<typeof tabNavVariants> &
  VariantProps<typeof tabButtonVariants> & { zAlignTabs: zAlign };
