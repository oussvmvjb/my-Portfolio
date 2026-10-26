export const SECTION_IDS = [
  "home", "about", "skills", "experience", "projects", "education", "creative", "contact",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Add a variant id here + a component in src/components/sections/<id>/<Variant>.tsx + register it in registry.ts */
export const SECTION_VARIANTS: Record<SectionId, { id: string; label: string }[]> = {
  home:       [{ id: "classic", label: "Classic" }, { id: "centered", label: "Centered" }, { id: "split", label: "Split" }, { id: "glitch", label: "Glitch" }],
  about:      [{ id: "cards", label: "Cards" }, { id: "story", label: "Story" }],
  skills:     [{ id: "grid", label: "Grid" }, { id: "tabs", label: "Tabs" }, { id: "marquee", label: "Marquee" }],
  experience: [{ id: "timeline", label: "Timeline" }, { id: "cards", label: "Cards" }],
  projects:   [{ id: "grid", label: "Grid" }, { id: "list", label: "List" }, { id: "carousel", label: "Carousel" }],
  education:  [{ id: "timeline", label: "Timeline" }, { id: "cards", label: "Cards" }],
  creative:   [{ id: "cards", label: "Cards" }, { id: "showcase", label: "Showcase" }],
  contact:    [{ id: "split", label: "Split" }, { id: "centered", label: "Centered" }],
};

export const PRIMARY_PRESETS = ["#6D5DF1", "#0D9488", "#FFA81D", "#EF3C64", "#1E90F0"] as const;

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  primary: string;                         // hex
  mode: ThemeMode;
  variants: Record<SectionId, string>;     // chosen design per section
  hidden: SectionId[];                     // sections turned off
  order: SectionId[];                      // section order
}

export const DEFAULT_THEME: ThemeState = {
  primary: PRIMARY_PRESETS[0],
  mode: "dark",
  variants: Object.fromEntries(
    SECTION_IDS.map((id) => [id, SECTION_VARIANTS[id][0].id]),
  ) as Record<SectionId, string>,
  hidden: [],
  order: [...SECTION_IDS],
};
