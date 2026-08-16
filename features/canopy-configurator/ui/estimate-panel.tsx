import { AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { CanopyEstimate, CanopyInput } from "@/entities/canopy";
import { formatRubles, roofMaterials } from "@/entities/canopy";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { CanopyPreview } from "./canopy-preview";

export function EstimatePanel({ input, estimate }: { input: CanopyInput; estimate: CanopyEstimate }) {
  return (
    <aside className="bg-neutral-950 p-5 text-white lg:sticky lg:top-24 lg:p-7">
      <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant="accent"><CheckCircle2 className="mr-1 size-3.5" />Расчёт обновлён</Badge>
        <span className="text-[10px] uppercase tracking-[.15em] text-neutral-500">MVP · предварительно</span>
      </div>

      <CanopyPreview input={input} estimate={estimate} />

      <div className="my-6 border-y border-white/10 py-5">
        <span className="text-[10px] font-bold uppercase tracking-[.12em] text-neutral-500">Ориентировочная стоимость</span>
        <strong className="my-2 block text-3xl tracking-tight">
          {formatRubles(estimate.minPrice)}–{formatRubles(estimate.maxPrice)} ₽
        </strong>
        <p className="text-xs leading-relaxed text-neutral-400">Материалы, изготовление, выбранные опции и резерв 10%.</p>
      </div>

      {estimate.warnings.length > 0 && (
        <div className="mb-5 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
          <strong className="flex items-center gap-2 text-xs text-orange-300"><AlertTriangle className="size-4" />Нужно уточнить</strong>
          {estimate.warnings.map((warning) => <p key={warning} className="mt-2 text-xs leading-relaxed text-orange-100/80">{warning}</p>)}
        </div>
      )}

      <dl className="grid grid-cols-2 border-t border-white/10 text-xs">
        <Spec term="Снеговая нагрузка" value={`${estimate.snow} кг/м²`} />
        <Spec term="Площадь кровли" value={`${estimate.area.toFixed(1)} м²`} />
        <Spec term="Опоры" value={`${estimate.posts} шт. · ${estimate.column}`} />
        <Spec term="Фермы" value={`${estimate.trusses} шт. · ${estimate.truss}`} />
        <Spec term="Прогоны" value={estimate.purlin} />
        <Spec term="Металл" value={`≈ ${estimate.steel} кг`} />
        <Spec term="Кровля" value={roofMaterials[input.roofMaterial].label} />
        <Spec term="Резерв 10%" value={`≈ ${estimate.reserve} кг`} />
      </dl>

      <Button variant="accent" size="lg" className="mt-6 w-full justify-between" asChild>
        <a href="#contact">Запросить точный расчёт <ArrowUpRight className="size-5" /></a>
      </Button>
      <p className="mt-3 text-[10px] leading-relaxed text-neutral-500">
        Результат не является рабочим проектом. Сечения, узлы и фундамент подтверждает инженер после осмотра объекта.
      </p>
    </aside>
  );
}

function Spec({ term, value }: { term: string; value: string }) {
  return (
    <div className="border-b border-white/10 py-4 odd:border-r odd:pr-3 even:pl-4">
      <dt className="text-[9px] uppercase tracking-[.08em] text-neutral-500">{term}</dt>
      <dd className="mt-1 font-bold leading-snug text-neutral-100">{value}</dd>
    </div>
  );
}
