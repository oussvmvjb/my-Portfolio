import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://oussama-jabri.dev";
  const locales = ["en", "fr", "ar", "zh"];

  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1.0 : 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        ar: `${baseUrl}/ar`,
        zh: `${baseUrl}/zh`,
      },
    },
  }));
}
