"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { CanopyEstimate, CanopyInput } from "@/entities/canopy";
import { roofTypeLabels } from "@/entities/canopy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

type Props = { input: CanopyInput; estimate: CanopyEstimate };
type Point3 = { x: number; y: number; z: number };
type Point2 = Point3 & { sx: number; sy: number; depth: number };
type Segment = { a: Point2; b: Point2; kind: "grid" | "post" | "beam" | "truss" | "brace" | "purlin" };
type Dimension = { a: Point2; b: Point2; label: string };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const positions = (count: number, length: number) => Array.from({ length: count }, (_, index) => count === 1 ? length / 2 : index * length / (count - 1));

function roofHeight(y: number, input: CanopyInput) {
  const t = y / input.width;
  if (input.roofType === "arched") return input.height + Math.sin(t * Math.PI) * Math.max(.55, input.width * .16);
  if (input.roofType === "double") return input.height + (1 - Math.abs(t * 2 - 1)) * input.width * .2;
  return input.height + t * input.width * .12;
}

function project(point: Point3, input: CanopyInput, yaw: number, pitch: number, zoom: number): Point2 {
  const yawRad = yaw * Math.PI / 180;
  const pitchRad = pitch * Math.PI / 180;
  const dx = point.x - input.length / 2;
  const dy = point.y - input.width / 2;
  const dz = point.z - input.height * .52;
  const rx = dx * Math.cos(yawRad) - dy * Math.sin(yawRad);
  const ry = dx * Math.sin(yawRad) + dy * Math.cos(yawRad);
  const vertical = dz * Math.cos(pitchRad) - ry * Math.sin(pitchRad);
  const depth = ry * Math.cos(pitchRad) + dz * Math.sin(pitchRad);
  const scale = 420 / Math.max(input.length, input.width * 1.45, 6) * zoom;
  return { ...point, sx: 350 + rx * scale, sy: 205 - vertical * scale, depth };
}

function InteractiveCanopy({ input, estimate }: Props) {
  const [yaw, setYaw] = useState(-34);
  const [pitch, setPitch] = useState(24);
  const [zoom, setZoom] = useState(1);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      setZoom((current) => clamp(current - event.deltaY * .0012, .65, 1.75));
    };
    svg.addEventListener("wheel", handleWheel, { passive: false });
    return () => svg.removeEventListener("wheel", handleWheel);
  }, []);

  const scene = useMemo(() => {
    const p = (point: Point3) => project(point, input, yaw, pitch, zoom);
    const segments: Segment[] = [];
    const add = (a: Point3, b: Point3, kind: Segment["kind"]) => segments.push({ a: p(a), b: p(b), kind });
    const postXs = positions(Math.max(2, Math.ceil(estimate.posts / 2)), input.length);
    const trussXs = positions(Math.max(2, estimate.trusses), input.length);
    const roofYs = positions(input.roofType === "arched" ? 9 : 5, input.width);

    for (const x of positions(7, input.length)) add({ x, y: 0, z: 0 }, { x, y: input.width, z: 0 }, "grid");
    for (const y of positions(6, input.width)) add({ x: 0, y, z: 0 }, { x: input.length, y, z: 0 }, "grid");

    for (const x of postXs) {
      add({ x, y: 0, z: 0 }, { x, y: 0, z: roofHeight(0, input) }, "post");
      add({ x, y: input.width, z: 0 }, { x, y: input.width, z: roofHeight(input.width, input) }, "post");
    }

    add({ x: 0, y: 0, z: roofHeight(0, input) }, { x: input.length, y: 0, z: roofHeight(0, input) }, "beam");
    add({ x: 0, y: input.width, z: roofHeight(input.width, input) }, { x: input.length, y: input.width, z: roofHeight(input.width, input) }, "beam");

    for (const x of trussXs) {
      const top = roofYs.map((y) => ({ x, y, z: roofHeight(y, input) }));
      for (let index = 0; index < top.length - 1; index++) add(top[index], top[index + 1], "truss");
      add({ x, y: 0, z: input.height }, { x, y: input.width, z: input.height }, "truss");
      for (let index = 0; index < top.length; index++) {
        const y = roofYs[index];
        const bottomY = index % 2 === 0 ? Math.min(input.width, y + input.width / (roofYs.length - 1)) : Math.max(0, y - input.width / (roofYs.length - 1));
        add({ x, y: bottomY, z: input.height }, top[index], "brace");
      }
    }

    for (const y of roofYs) add({ x: 0, y, z: roofHeight(y, input) }, { x: input.length, y, z: roofHeight(y, input) }, "purlin");

    const roofBands = roofYs.slice(0, -1).map((y, index) => {
      const nextY = roofYs[index + 1];
      return [p({ x: 0, y, z: roofHeight(y, input) }), p({ x: input.length, y, z: roofHeight(y, input) }), p({ x: input.length, y: nextY, z: roofHeight(nextY, input) }), p({ x: 0, y: nextY, z: roofHeight(nextY, input) })];
    });

    const dimensions: Dimension[] = [
      { a: p({ x: 0, y: -.55, z: 0 }), b: p({ x: input.length, y: -.55, z: 0 }), label: `${input.length} м` },
      { a: p({ x: input.length + .45, y: 0, z: 0 }), b: p({ x: input.length + .45, y: input.width, z: 0 }), label: `${input.width} м` },
      { a: p({ x: input.length, y: input.width + .45, z: 0 }), b: p({ x: input.length, y: input.width + .45, z: input.height }), label: `${input.height} м` },
    ];

    return { segments: segments.sort((a, b) => ((a.a.depth + a.b.depth) - (b.a.depth + b.b.depth))), roofBands, dimensions };
  }, [estimate.posts, estimate.trusses, input, pitch, yaw, zoom]);

  const resetView = () => { setYaw(-34); setPitch(24); setZoom(1); };
  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = { x: event.clientX, y: event.clientY, yaw, pitch };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    setYaw(drag.current.yaw + (event.clientX - drag.current.x) * .42);
    setPitch(clamp(drag.current.pitch - (event.clientY - drag.current.y) * .3, 7, 68));
  };
  const stopDrag = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const stroke = { grid: "#343a33", post: "#d2d8d4", beam: "#aeb7b2", truss: "#d9ff43", brace: "#8fa63d", purlin: "#77817a" };
  const width = { grid: 1, post: 7, beam: 7, truss: 4, brace: 2, purlin: 2 };

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
      <svg
        ref={svgRef}
        viewBox="0 0 700 410"
        className="block w-full cursor-grab touch-none select-none active:cursor-grabbing"
        role="img"
        aria-label={`Интерактивная модель навеса: ${estimate.trusses} ферм, ${estimate.posts} опор. Тяните для поворота, используйте колесо для масштаба.`}
        data-trusses={estimate.trusses}
        data-posts={estimate.posts}
        data-yaw={yaw.toFixed(1)}
        data-pitch={pitch.toFixed(1)}
        data-zoom={zoom.toFixed(2)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <defs>
          <radialGradient id="modelGlow"><stop stopColor="#d9ff43" stopOpacity=".17" /><stop offset="1" stopColor="#d9ff43" stopOpacity="0" /></radialGradient>
          <linearGradient id="modelRoof" x1="0" x2="1"><stop stopColor="#d9ff43" stopOpacity=".2" /><stop offset="1" stopColor="#7f9f21" stopOpacity=".08" /></linearGradient>
        </defs>
        <rect width="700" height="410" fill="#171a16" />
        <circle cx="350" cy="190" r="250" fill="url(#modelGlow)" />
        {scene.roofBands.map((band, index) => <polygon key={index} points={band.map((point) => `${point.sx},${point.sy}`).join(" ")} fill="url(#modelRoof)" stroke="rgba(217,255,67,.13)" />)}
        {scene.segments.map((segment, index) => (
          <line key={index} x1={segment.a.sx} y1={segment.a.sy} x2={segment.b.sx} y2={segment.b.sy} stroke={stroke[segment.kind]} strokeWidth={width[segment.kind]} strokeLinecap="round" opacity={segment.kind === "grid" ? .55 : 1} />
        ))}
        {scene.dimensions.map((dimension) => {
          const x = (dimension.a.sx + dimension.b.sx) / 2;
          const y = (dimension.a.sy + dimension.b.sy) / 2;
          return <g key={dimension.label + dimension.a.sx}>
            <line x1={dimension.a.sx} y1={dimension.a.sy} x2={dimension.b.sx} y2={dimension.b.sy} stroke="#ff8150" strokeWidth="1.5" strokeDasharray="6 5" />
            <circle cx={dimension.a.sx} cy={dimension.a.sy} r="3" fill="#ff8150" />
            <circle cx={dimension.b.sx} cy={dimension.b.sy} r="3" fill="#ff8150" />
            <text x={x} y={y - 8} textAnchor="middle" fill="#ff9a72" fontSize="13" fontWeight="800" paintOrder="stroke" stroke="#171a16" strokeWidth="4">{dimension.label}</text>
          </g>;
        })}
      </svg>

      <div className="pointer-events-none absolute left-3 top-14 flex flex-wrap gap-1.5 text-[9px] font-black uppercase tracking-[.1em] sm:top-3">
        <span className="rounded bg-black/65 px-2 py-1.5 text-lime-300">Ферм: {estimate.trusses}</span>
        <span className="rounded bg-black/65 px-2 py-1.5 text-white">Опор: {estimate.posts}</span>
      </div>
      <div className="absolute right-3 top-3 flex gap-1">
        <span className="grid h-9 min-w-12 place-items-center rounded bg-black/70 px-2 text-[10px] font-black text-lime-300" aria-label="Текущий масштаб">{Math.round(zoom * 100)}%</span>
        <button type="button" className="grid size-9 place-items-center rounded bg-black/70 text-lg text-white hover:bg-black" aria-label="Уменьшить модель" onClick={() => setZoom((value) => clamp(value - .12, .65, 1.75))}>−</button>
        <button type="button" className="grid size-9 place-items-center rounded bg-black/70 text-lg text-white hover:bg-black" aria-label="Увеличить модель" onClick={() => setZoom((value) => clamp(value + .12, .65, 1.75))}>+</button>
        <button type="button" className="grid size-9 place-items-center rounded bg-black/70 text-base text-white hover:bg-black" aria-label="Сбросить вид модели" onClick={resetView}>↺</button>
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-16 flex items-end justify-between gap-3 text-[9px] uppercase tracking-[.08em] text-neutral-400">
        <span>Тяните — поворот · колесо — масштаб</span>
        <span className="text-right">{input.length} × {input.width} × {input.height} м</span>
      </div>
      <div className="grid grid-cols-3 border-t border-white/10 bg-black/45 text-[9px] leading-tight">
        <div className="min-w-0 p-3"><span className="block uppercase tracking-[.1em] text-neutral-500">Опоры</span><strong className="mt-1 block break-words text-neutral-200">{estimate.column}</strong></div>
        <div className="min-w-0 border-x border-white/10 p-3"><span className="block uppercase tracking-[.1em] text-neutral-500">Фермы</span><strong className="mt-1 block break-words text-neutral-200">{estimate.truss}</strong></div>
        <div className="min-w-0 p-3"><span className="block uppercase tracking-[.1em] text-neutral-500">Прогоны</span><strong className="mt-1 block break-words text-neutral-200">{estimate.purlin}</strong></div>
      </div>
    </div>
  );
}

export function CanopyPreview({ input, estimate }: Props) {
  const posts = positions(Math.max(2, Math.ceil(estimate.posts / 2)), 330);
  const roofLabel = roofTypeLabels[input.roofType];

  return (
    <Tabs defaultValue="3d" className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">Инженерный макет</p>
          <p className="mt-1 text-sm font-extrabold text-white">{roofLabel} · {input.length} × {input.width} × {input.height} м</p>
        </div>
        <TabsList className="bg-white/10">
          <TabsTrigger value="2d" className="text-neutral-400 data-[state=active]:bg-lime-300">2D</TabsTrigger>
          <TabsTrigger value="3d" className="text-neutral-400 data-[state=active]:bg-lime-300">3D</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="3d"><InteractiveCanopy input={input} estimate={estimate} /></TabsContent>

      <TabsContent value="2d">
        <svg viewBox="0 0 700 390" className="w-full rounded-lg border border-white/10 bg-white" role="img" aria-label="План и фасад навеса">
          <rect x="75" y="65" width="330" height="165" fill="#f6f7f2" stroke="#171915" strokeWidth="3" />
          {posts.map((x) => <g key={x}><rect x={x - 5} y="60" width="10" height="10" fill="#ff6c2f" /><rect x={x - 5} y="225" width="10" height="10" fill="#ff6c2f" /></g>)}
          <line x1="75" y1="252" x2="405" y2="252" stroke="#171915" strokeDasharray="5 4" />
          <text x="222" y="275" fill="#171915" fontSize="14">{input.length} м · план</text>
          <line x1="45" y1="65" x2="45" y2="230" stroke="#171915" strokeDasharray="5 4" />
          <text x="22" y="165" fill="#171915" fontSize="14" transform="rotate(-90 22 165)">{input.width} м</text>
          <line x1="480" y1="300" x2="480" y2="140" stroke="#171915" strokeWidth="7" />
          <line x1="630" y1="300" x2="630" y2="140" stroke="#171915" strokeWidth="7" />
          <path d={input.roofType === "arched" ? "M470 145 Q555 65 640 145" : input.roofType === "double" ? "M470 145 L555 85 L640 145" : "M470 145 L640 120"} fill="none" stroke="#171915" strokeWidth="8" />
          <line x1="655" y1="300" x2="655" y2="140" stroke="#ff6c2f" strokeDasharray="5 4" />
          <text x="677" y="235" fill="#171915" fontSize="14" transform="rotate(-90 677 235)">{input.height} м</text>
          <text x="515" y="335" fill="#171915" fontSize="14">фасад</text>
        </svg>
      </TabsContent>
    </Tabs>
  );
}
