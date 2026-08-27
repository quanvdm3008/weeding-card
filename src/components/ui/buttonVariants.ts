import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        link: "rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline",
        luxury: "btn-luxury",
        "ghost-luxury": "btn-ghost-luxury",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-10 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    compoundVariants: [
      { variant: ["luxury", "ghost-luxury"], size: ["default", "sm", "lg", "icon"], className: "h-auto px-8 py-4" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
