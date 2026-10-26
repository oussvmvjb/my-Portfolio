import type { Content, Locale } from "@/types/content";
import en from "../../content/en.json";
import fr from "../../content/fr.json";
import ar from "../../content/ar.json";
import zh from "../../content/zh.json";

const contents: Record<Locale, Content> = {
  en: en as unknown as Content,
  fr: fr as unknown as Content,
  ar: ar as unknown as Content,
  zh: zh as unknown as Content,
};

export function getContent(locale?: string): Content {
  if (!locale) return contents.en;
  return contents[locale as Locale] ?? contents.en;
}
