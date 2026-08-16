"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "@/shared/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn("peer size-5 shrink-0 rounded border border-neutral-400 bg-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-500 data-[state=checked]:border-neutral-950 data-[state=checked]:bg-neutral-950", className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-lime-300">
        <Check className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
