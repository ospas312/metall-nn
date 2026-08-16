import * as React from "react";
import { cn } from "@/shared/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn("flex h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-500 disabled:opacity-50", className)}
      {...props}
    />
  );
}

export { Input };
