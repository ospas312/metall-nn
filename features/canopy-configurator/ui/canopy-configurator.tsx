"use client";

import { useMemo, useState } from "react";
import {
  calculateCanopy,
  defaultCanopyInput,
  regions,
  roofMaterials,
  roofTypeLabels,
  soilLabels,
  type CanopyInput,
  type InstallType,
  type RegionKey,
  type RoofMaterialKey,
  type RoofType,
  type SoilKey,
} from "@/entities/canopy";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { ConfigSection, DimensionField, FieldLabel } from "./config-controls";
import { EstimatePanel } from "./estimate-panel";

export function CanopyConfigurator() {
  const [input, setInput] = useState<CanopyInput>({ ...defaultCanopyInput });
  const estimate = useMemo(() => calculateCanopy(input), [input]);
  const update = <K extends keyof CanopyInput,>(key: K, value: CanopyInput[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const changeMaterial = (roofMaterial: RoofMaterialKey) => {
    setInput((current) => ({ ...current, roofMaterial, thickness: roofMaterials[roofMaterial].sizes[0] }));
  };

  return (
    <Card className="grid overflow-visible rounded-none shadow-2xl lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,.95fr)]">
      <div className="px-5 sm:px-8 lg:px-10">
        <ConfigSection number="01" title="Место и форма">
          <FieldLabel>Регион строительства</FieldLabel>
          <Select value={input.region} onValueChange={(value) => update("region", value as RegionKey)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(regions).map(([key, region]) => <SelectItem key={key} value={key}>{region.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <FieldLabel className="mt-5">Тип крыши</FieldLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.entries(roofTypeLabels) as [RoofType, string][]).map(([key, label]) => (
              <Button
                key={key}
                type="button"
                variant={input.roofType === key ? "accent" : "outline"}
                className="h-auto min-h-16 whitespace-normal px-2 text-center"
                onClick={() => update("roofType", key)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 rounded-lg bg-neutral-100 p-1 sm:grid-cols-2">
            {([["free", "Отдельно стоящий"], ["wall", "Примыкающий"]] as [InstallType, string][]).map(([key, label]) => (
              <Button key={key} type="button" size="sm" variant={input.installType === key ? "default" : "ghost"} className="h-auto min-h-9 whitespace-normal px-2 text-center leading-tight" onClick={() => update("installType", key)}>
                {label}
              </Button>
            ))}
          </div>
        </ConfigSection>

        <ConfigSection number="02" title="Габариты">
          <div className="space-y-7">
            <DimensionField label="Длина" value={input.length} min={3} max={20} step={0.5} onChange={(value) => update("length", value)} />
            <DimensionField label="Ширина" value={input.width} min={2.5} max={10} step={0.5} onChange={(value) => update("width", value)} />
            <DimensionField label="Высота" value={input.height} min={2.2} max={5} step={0.1} onChange={(value) => update("height", value)} />
          </div>
        </ConfigSection>

        <ConfigSection number="03" title="Материалы и основание">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Материал кровли</FieldLabel>
              <Select value={input.roofMaterial} onValueChange={(value) => changeMaterial(value as RoofMaterialKey)}>
                <SelectTrigger aria-label="Материал кровли"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(roofMaterials).map(([key, material]) => <SelectItem key={key} value={key}>{material.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FieldLabel>Толщина, мм</FieldLabel>
              <Select value={String(input.thickness)} onValueChange={(value) => update("thickness", Number(value))}>
                <SelectTrigger aria-label="Толщина кровли"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roofMaterials[input.roofMaterial].sizes.map((size) => <SelectItem key={size} value={String(size)}>{size} мм</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FieldLabel>Желаемое число опор</FieldLabel>
              <Input aria-label="Желаемое число опор" type="number" min={2} max={30} value={input.wantedPosts} onChange={(event) => update("wantedPosts", Number(event.target.value))} />
            </div>
            <div>
              <FieldLabel>Тип грунта</FieldLabel>
              <Select value={input.soil} onValueChange={(value) => update("soil", value as SoilKey)}>
                <SelectTrigger aria-label="Тип грунта"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(soilLabels).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ConfigSection>

        <ConfigSection number="04" title="Комплектация">
          <div className="flex flex-wrap gap-x-7 gap-y-4">
            <Option checked={input.installation} onCheckedChange={(checked) => update("installation", checked === true)}>Монтаж</Option>
            <Option checked={input.delivery} onCheckedChange={(checked) => update("delivery", checked === true)}>Доставка</Option>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-neutral-500">Дополнительные нагрузки — освещение, водосток и мелкие подвесные элементы — учтены общим резервом 10%.</p>
        </ConfigSection>
      </div>

      <EstimatePanel input={input} estimate={estimate} />
    </Card>
  );
}

function Option({ children, checked, onCheckedChange }: { children: string; checked: boolean; onCheckedChange: (checked: boolean | "indeterminate") => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      {children}
    </label>
  );
}
