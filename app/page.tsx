import Image from "next/image";
import { CanopyConfigurator } from "@/features/canopy-configurator";
import { PortfolioSection } from "@/features/portfolio";

export default function HomePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="МЕТАЛЛ НН — на главную">
          <span className="brand-mark">М</span>
          <span><strong>МЕТАЛЛ.НН</strong><small>мастерская конструкций</small></span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#calculator">Конструктор</a>
          <a href="#portfolio">Работы</a>
          <a href="#process">Как работаем</a>
        </nav>
        <a className="header-cta" href="#calculator">Рассчитать навес</a>
      </header>

      <section className="showcase-banner" aria-label="Инженерный баннер МЕТАЛЛ.НН">
        <Image
          src={`${basePath}/og.png`}
          alt="Арочный металлический навес с инженерными размерами"
          width={1792}
          height={919}
          priority
          sizes="100vw"
        />
      </section>

      <section className="hero hero-compact">
        <div className="hero-copy">
          <div className="eyebrow"><span />Металлоконструкции под задачу</div>
          <h1>Навес, который<br /><em>посчитан</em> до сварки</h1>
          <p className="hero-lead">Задайте размеры и материалы. Конструктор покажет форму, предварительно подберёт профили и рассчитает диапазон стоимости.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#calculator">Собрать свой навес <span>↗</span></a>
            <a className="text-link" href="#portfolio">Смотреть работы <span>→</span></a>
          </div>
          <div className="trust-row">
            <div><strong>10+</strong><span>лет в металле</span></div>
            <div><strong>240</strong><span>готовых объектов</span></div>
            <div><strong>1 год</strong><span>гарантии на монтаж</span></div>
          </div>
        </div>
      </section>

      <section className="calculator-section" id="calculator">
        <div className="section-heading">
          <div><span className="section-number">01 / Конструктор</span><h2>Соберите<br />свой навес</h2></div>
          <p>Все параметры меняются в реальном времени. Расчёт ориентировочный: финальные сечения и узлы подтверждаются после осмотра объекта.</p>
        </div>
        <CanopyConfigurator />
      </section>

      <PortfolioSection />

      <section className="process-section" id="process">
        <div className="section-heading">
          <div><span className="section-number">03 / Процесс</span><h2>От расчёта<br />до монтажа</h2></div>
        </div>
        <div className="process-grid">
          <article><span>01</span><h3>Конфигурация</h3><p>Вы задаёте габариты, форму, материал кровли и условия участка.</p></article>
          <article><span>02</span><h3>Проверка</h3><p>Мастер уточняет нагрузки, фундамент, узлы примыкания и доступ для монтажа.</p></article>
          <article><span>03</span><h3>Производство</h3><p>Фиксируем смету, закупаем металл, изготавливаем и окрашиваем конструкцию.</p></article>
          <article><span>04</span><h3>Монтаж</h3><p>Доставляем, собираем конструкцию на объекте и сдаём готовую работу.</p></article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <h2>Обсудим<br /><em>ваш навес?</em></h2>
        <div className="contact-card">
          <p>Контакты и форма заявки будут подключены после согласования способа обработки обращений.</p>
          <a href="#calculator">Вернуться к расчёту <span>↑</span></a>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">М</span><span><strong>МЕТАЛЛ.НН</strong><small>локальная версия MVP</small></span></div>
        <p>Предварительный расчёт не является проектной документацией</p>
      </footer>
    </main>
  );
}
