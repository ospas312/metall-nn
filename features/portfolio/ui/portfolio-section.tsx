"use client";

import Image from "next/image";
import { ArrowUpRight, MapPin, Ruler, Weight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

const filters = [
  ["all", "Все проекты"],
  ["canopy", "Навесы"],
  ["stairs", "Лестницы"],
  ["gazebo", "Беседки"],
] as const;

type Project = {
  id: string;
  category: "canopy" | "stairs" | "gazebo";
  categoryLabel: string;
  title: string;
  location: string;
  size: string;
  material: string;
  steel: string;
  year: string;
  tone: "lime" | "orange" | "blue" | "steel";
  image?: string;
  featured?: boolean;
};

const projects: readonly Project[] = [
  {
    id: "carport-9x6",
    category: "canopy",
    categoryLabel: "Навес для автомобилей",
    title: "Арочная конструкция на две машины",
    location: "Нижний Новгород",
    size: "9 × 6 × 3,6 м",
    material: "Поликарбонат 10 мм",
    steel: "≈ 1 240 кг",
    year: "2026",
    image: "/portfolio/arched-carport.webp",
    tone: "lime",
    featured: true,
  },
  {
    id: "stairs-home",
    category: "stairs",
    categoryLabel: "Лестница в дом",
    title: "Каркас лестницы с площадкой",
    location: "Кстово",
    size: "Высота 3,1 м",
    material: "Профильная труба",
    steel: "≈ 460 кг",
    year: "2026",
    image: "/portfolio/steel-staircase.webp",
    tone: "orange",
  },
  {
    id: "gazebo-family",
    category: "gazebo",
    categoryLabel: "Садовая беседка",
    title: "Беседка с двускатной кровлей",
    location: "Бор",
    size: "5 × 4 м",
    material: "Металлочерепица",
    steel: "≈ 680 кг",
    year: "2025",
    image: "/portfolio/garden-gazebo.webp",
    tone: "blue",
  },
  {
    id: "lean-canopy",
    category: "canopy",
    categoryLabel: "Навес к дому",
    title: "Односкатный навес с примыканием",
    location: "Дзержинск",
    size: "7 × 3,5 м",
    material: "Профнастил 0,5 мм",
    steel: "≈ 720 кг",
    year: "2025",
    image: "/portfolio/lean-to-canopy.webp",
    tone: "steel",
  },
];

type Filter = (typeof filters)[number][0];

export function PortfolioSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleProjects = projects.filter((project) => filter === "all" || project.category === filter);

  return (
    <section className="portfolio-v2" id="portfolio">
      <div className="portfolio-v2-heading">
        <div>
          <span className="section-number light">02 / Выполненные работы</span>
          <h2>Не картинки.<br /><em>Решённые задачи.</em></h2>
        </div>
        <div className="portfolio-v2-intro">
          <p>Показываем не только внешний вид, но и габариты, материалы и массу металла. Сейчас стоят демонстрационные данные — заменим их реальными объектами мастерской.</p>
          <div className="portfolio-v2-count"><strong>240+</strong><span>конструкций изготовлено</span></div>
        </div>
      </div>

      <div className="portfolio-filters" role="group" aria-label="Фильтр выполненных работ">
        {filters.map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>

      <div className="portfolio-v2-grid" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <article className={`portfolio-case portfolio-case-${project.tone} ${project.featured && filter === "all" ? "portfolio-case-featured" : ""}`} key={project.id}>
            <div className="portfolio-case-visual">
              {project.image ? (
                <Image src={project.image} alt="" fill sizes={project.featured ? "(max-width: 900px) 100vw, 62vw" : "(max-width: 900px) 100vw, 40vw"} />
              ) : (
                <div className="portfolio-case-drawing" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i /><i /><i />
                </div>
              )}
              <Badge variant="accent" className="portfolio-case-badge">{project.year}</Badge>
            </div>
            <div className="portfolio-case-body">
              <span className="portfolio-case-type">{project.categoryLabel}</span>
              <h3>{project.title}</h3>
              <dl>
                <div><dt><MapPin /></dt><dd>{project.location}</dd></div>
                <div><dt><Ruler /></dt><dd>{project.size}</dd></div>
                <div><dt><Weight /></dt><dd>{project.steel}</dd></div>
              </dl>
              <div className="portfolio-case-footer">
                <span>{project.material}</span>
                <span className="portfolio-case-link" aria-hidden="true"><ArrowUpRight /></span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="portfolio-v2-cta">
        <div><span>Есть похожая задача?</span><strong>Соберите предварительный расчёт за пару минут.</strong></div>
        <Button variant="accent" size="lg" asChild><a href="#calculator">Открыть конструктор <ArrowUpRight /></a></Button>
      </div>
    </section>
  );
}
