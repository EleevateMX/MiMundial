import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Mundial — Arma tu cuadro y predice al campeón",
  description:
    "Elige a tu selección, predice quién le gana a quién y compite en el ranking global de predicciones. Sin apuestas, solo gloria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
