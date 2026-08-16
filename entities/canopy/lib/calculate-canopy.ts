import { regions, roofMaterials } from "../model/catalogs";
import type { CanopyEstimate, CanopyInput } from "../model/types";

export function calculateCanopy(input: CanopyInput): CanopyEstimate {
  const climate = regions[input.region];
  const roof = roofMaterials[input.roofMaterial];
  const shapeFactor = input.roofType === "arched" ? 1.08 : input.roofType === "double" ? 1.06 : 1.04;
  const area = input.length * input.width * shapeFactor;
  const highLoad = climate.snow >= 300 || input.width > 5;
  const postsPerRow = Math.ceil(input.length / (highLoad ? 2.25 : 2.8)) + 1;
  const minimumPosts = input.installType === "free" ? postsPerRow * 2 : postsPerRow;
  const posts = Math.max(input.wantedPosts, minimumPosts);
  const trusses = Math.ceil(input.length / (highLoad ? 1.25 : 1.5)) + 1;

  const column =
    input.width > 6 || climate.snow >= 350
      ? "120×120×4 мм"
      : input.width > 4.5 || input.height > 3
        ? "100×100×4 мм"
        : "80×80×3 мм";
  const truss =
    input.width > 6
      ? "80×40×3 / 40×40×2 мм"
      : input.width > 4.5 || climate.snow >= 350
        ? "60×40×3 / 40×40×2 мм"
        : "60×40×2 / 40×20×2 мм";
  const purlin = climate.snow >= 350 ? "60×40×2 мм" : "40×20×2 мм";

  const columnKgM = column.startsWith("120") ? 14.6 : column.startsWith("100") ? 12.1 : 7.1;
  const trussKgM = input.width > 6 ? 7.8 : input.width > 4.5 ? 6.2 : 5.1;
  const columnMass = posts * input.height * columnKgM;
  const trussMass = trusses * input.width * 2.45 * trussKgM;
  const steel = Math.round(columnMass + trussMass + (area / 0.7) * 2.1 + (columnMass + trussMass) * 0.09);
  const reserve = Math.round((steel + area * roof.weight) * 0.1);

  const steelCost = steel * 205;
  const roofCost = area * roof.price * (1 + input.thickness * 0.005);
  const foundation =
    input.soil === "unknown" ? posts * 4900 : input.soil === "weak" ? posts * 7600 : posts * 4300;
  const workCost = steel * 190;
  const installationCost = input.installation ? (steelCost + roofCost) * 0.22 : 0;
  const deliveryCost = input.delivery ? 12500 : 0;
  const total = Math.round(
    (steelCost + roofCost + workCost + foundation + installationCost + deliveryCost) / 1000,
  ) * 1000;

  const warnings: string[] = [];
  if (minimumPosts > input.wantedPosts) {
    warnings.push(`Количество опор увеличено с ${input.wantedPosts} до ${posts} для выбранного пролёта.`);
  }
  if (input.soil === "unknown") {
    warnings.push("Фундамент рассчитан ориентировочно: тип грунта не указан.");
  }

  return {
    area,
    posts,
    trusses,
    column,
    truss,
    purlin,
    steel,
    reserve,
    warnings,
    minPrice: Math.round((total * 0.9) / 1000) * 1000,
    maxPrice: Math.round((total * 1.12) / 1000) * 1000,
    snow: climate.snow,
    wind: climate.wind,
  };
}

export const formatRubles = (value: number) => new Intl.NumberFormat("ru-RU").format(value);
