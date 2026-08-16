import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold", {
  variants: {
    variant: {
      default: "bg-neutral-950 text-white",
      accent: "bg-lime-300 text-neutral-950",
      warning: "bg-orange-100 text-orange-800",
      outline: "border border-neutral-300 text-neutral-700",
    },
  },
  defaultVariants: { variant: "default" },
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
