# Jabri Oussama — Personal Portfolio

Modern, high-performance portfolio website built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, full **i18n (English, French, Arabic RTL, Chinese)**, and a **dynamic real-time theme & section layout customization system**.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and set your Resend API credentials for the contact form:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Available Scripts

- `npm run dev`: Start development server with Turbopack.
- `npm run build`: Build production bundle with static page generation.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint checks.
- `npm run check:i18n`: Verify all locales (`fr.json`, `ar.json`, `zh.json`) have 100% key parity with `en.json`.

---

## 🎨 Theme & Section Customization System

Click the **Palette icon** floating at the bottom-end of the screen to open the **Theme Customizer**:
- **Theming Tab**:
  - **Primary Color**: 5 presets + custom color picker. Changing it recolors buttons, glow effects, progress bars, links, chips, and glitch elements across the entire app instantly without reloading.
  - **Mode**: Light, Dark, or System mode.
  - State is saved in `localStorage["portfolio-theme-v1"]` and applied instantly via an inline pre-hydration script to eliminate any flash of unstyled theme.
- **Sections Tab**:
  - Choose between multiple designs for any section in real time.
  - Reorder sections up and down.
  - Hide or show any section.

---

## 🧩 Adding a New Section Design (Variant)

To add a new design for any section (e.g., adding `bento` to `projects`):

1. **Create the component**:
   Create `src/components/sections/projects/Bento.tsx`:
   ```tsx
   import type { SectionProps } from "../registry";

   export default function ProjectsBento({ content }: SectionProps) {
     return <div>{/* Your custom layout */}</div>;
   }
   ```
2. **Register in `registry.ts`**:
   In `src/components/sections/registry.ts`, import your component and register it:
   ```ts
   import ProjectsBento from "./projects/Bento";

   export const REGISTRY = {
     // ...
     projects: {
       grid: ProjectsGrid,
       list: ProjectsList,
       carousel: ProjectsCarousel,
       bento: ProjectsBento, // <-- added here
     },
   };
   ```
3. **Add option in `sections.ts`**:
   In `src/config/sections.ts`, add the variant ID and label under `SECTION_VARIANTS`:
   ```ts
   projects: [
     { id: "grid", label: "Grid" },
     { id: "list", label: "List" },
     { id: "carousel", label: "Carousel" },
     { id: "bento", label: "Bento" }, // <-- added here
   ],
   ```

---

## 🌐 Adding a New Language

1. Create `content/<locale>.json` (copy `content/en.json` and translate string values).
   - Keep keys, URLs, emails, numbers, and tech names untranslated.
   - Set `"meta.locale": "<locale>"` and `"meta.dir": "ltr"` (or `"rtl"` for RTL scripts).
2. Add the locale code to `src/i18n/routing.ts`:
   ```ts
   export const routing = defineRouting({
     locales: ["en", "fr", "ar", "zh", "es"],
     defaultLocale: "en",
     localePrefix: "always",
   });
   ```
3. Add the locale to `src/types/content.ts`, `src/lib/content.ts`, `src/components/ui/LanguageSwitcher.tsx`, and `src/app/[locale]/layout.tsx`.
4. Run `npm run check:i18n` to verify key parity.

---

## 📁 Adding a Project

To add or update a project, edit `content/en.json` (and the corresponding localized JSON files) under `"projects.items"`:
```json
{
  "id": "my-project",
  "title": "My Awesome Project",
  "category": ["web"],
  "featured": true,
  "description": "A high-performance web application.",
  "tech": ["Next.js", "TypeScript", "Tailwind CSS"],
  "github": "https://github.com/...",
  "live": "https://..."
}
```
*Note: If `github` or `live` is empty (`""`), the corresponding button will automatically be hidden.*
