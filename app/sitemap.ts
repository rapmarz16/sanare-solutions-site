import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://sanaresolutions.ca",
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://sanaresolutions.ca/privacy",
      lastModified: new Date("2026-08-03"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
