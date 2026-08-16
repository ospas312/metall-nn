"use client";

import type { ReactNode } from "react";
import { Slider } from "@/shared/ui/slider";
import { cn } from "@/shared/lib/utils";

export function ConfigSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-neutral-200 py-7 last:border-0">
      <legend className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[.13em]">
        <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-lime-300">{number}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function FieldLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("mb-2 block text-xs font-bold text-neutral-600", className)}>{children}</span>;
}

type DimensionFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
};

export function DimensionField({ label, value, min, max, step, unit = "м", onChange }: DimensionFieldProps) {
  return (
    <label className="block">
      <span className="mb-3 flex items-center justify-between text-xs font-bold text-neutral-600">
        {label}
        <strong className="text-base text-neutral-950">{value} {unit}</strong>
      </span>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([next]) => onChange(next)} />
      <span className="mt-2 flex justify-between text-[10px] text-neutral-400"><i>{min} {unit}</i><i>{max} {unit}</i></span>
    </label>
  );
}
