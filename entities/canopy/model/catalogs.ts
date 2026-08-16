import type { RegionKey, RoofMaterialKey, RoofType, SoilKey } from "./types";

export const regions: Record<RegionKey, { label: string; snow: number; wind: number }> = {
  nizhny: { label: "Нижегородская область", snow: 280, wind: 38 },
  moscow: { label: "Москва и Московская область", snow: 250, wind: 38 },
  tatarstan: { label: "Республика Татарстан", snow: 280, wind: 38 },
  vladimir: { label: "Владимирская область", snow: 250, wind: 38 },
  kirov: { label: "Кировская область", snow: 350, wind: 32 },
};

export const roofMaterials: Record<RoofMaterialKey, { label: string; sizes: number[]; price: number; weight: number }> = {
  polycarbonate: { label: "Поликарбонат", sizes: [8, 10, 12], price: 1450, weight: 1.7 },
  profsheet: { label: "Профнастил", sizes: [0.45, 0.5, 0.7], price: 1150, weight: 5.2 },
  metalTile: { label: "Металлочерепица", sizes: [0.45, 0.5], price: 1350, weight: 5 },
};

export const roofTypeLabels: Record<RoofType, string> = {
  single: "Односкатный",
  double: "Двускатный",
  arched: "Арочный",
};

export const soilLabels: Record<SoilKey, string> = {
  unknown: "Не знаю",
  stable: "Плотный / устойчивый",
  weak: "Слабый / водонасыщенный",
};

export const defaultCanopyInput = {
  region: "nizhny",
  roofType: "arched",
  installType: "free",
  length: 6,
  width: 4,
  height: 2.7,
  roofMaterial: "polycarbonate",
  thickness: 10,
  wantedPosts: 6,
  soil: "unknown",
  installation: true,
  delivery: false,
} as const;
