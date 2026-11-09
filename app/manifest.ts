import type { MetadataRoute } from "next";
import { MENU_NAME, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: MENU_NAME,
    description: SITE_DESCRIPTION,
    lang: "ko",
    start_url: "/",
    display: "standalone",
    background_color: "#290044",
    theme_color: "#290044",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
