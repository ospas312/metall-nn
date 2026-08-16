import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "МЕТАЛЛ.НН — навесы и металлоконструкции",
  description: "Конструктор навеса: размеры, материалы, предварительный макет и ориентировочная стоимость.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Навес, который посчитан до сварки",
    description: "Макет, материалы и предварительная стоимость навеса.",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/og.png", width: 1792, height: 919, alt: "МЕТАЛЛ.НН — конструктор навеса" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
