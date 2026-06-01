import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mi Mundial — Predicciones",
    short_name: "Mi Mundial",
    description:
      "Arma tu cuadro, predice quién le gana a quién y compite en el ranking global. Solo predicciones, sin apuestas.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#05070f",
    theme_color: "#05070f",
    categories: ["sports", "games", "entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Mi Cuadro", url: "/jugar", description: "Edita tu bracket" },
      { name: "Ranking", url: "/jugar", description: "Mira el ranking" },
    ],
  };
}
