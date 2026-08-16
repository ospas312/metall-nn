export type RoofType = "single" | "double" | "arched";
export type InstallType = "free" | "wall";
export type RegionKey = "nizhny" | "moscow" | "tatarstan" | "vladimir" | "kirov";
export type RoofMaterialKey = "polycarbonate" | "profsheet" | "metalTile";
export type SoilKey = "unknown" | "stable" | "weak";

export type CanopyInput = {
  region: RegionKey;
  roofType: RoofType;
  installType: InstallType;
  length: number;
  width: number;
  height: number;
  roofMaterial: RoofMaterialKey;
  thickness: number;
  wantedPosts: number;
  soil: SoilKey;
  installation: boolean;
  delivery: boolean;
};

export type CanopyEstimate = {
  area: number;
  posts: number;
  trusses: number;
  column: string;
  truss: string;
  purlin: string;
  steel: number;
  reserve: number;
  warnings: string[];
  minPrice: number;
  maxPrice: number;
  snow: number;
  wind: number;
};
