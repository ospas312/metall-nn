import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.GITHUB_PAGES === "true"
  ? "https://ospas312.github.io/metall-nn"
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "МЕТАЛЛ.НН — навесы и металлоконструкции",
  description: "Конструктор навеса: размеры, материалы, предварительный макет и ориентировочная стоимость.",
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title: "Навес, который посчитан до сварки",
    description: "Макет, материалы и предварительная стоимость навеса.",
    type: "website",
    locale: "ru_RU",
    images: [{ url: `${siteUrl}/og.png`, width: 1792, height: 919, alt: "МЕТАЛЛ.НН — конструктор навеса" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
