import type { ComponentType } from "react";
import type { SectionId } from "@/config/sections";
import type { Content } from "@/types/content";

export type SectionProps = { content: Content };
type Registry = Record<SectionId, Record<string, ComponentType<SectionProps>>>;

/** One import per design. File layout: sections/<section>/<Variant>.tsx (default export). */
import HomeClassic from "./home/Classic";
import HomeCentered from "./home/Centered";
import HomeSplit from "./home/Split";
import HomeGlitch from "./home/Glitch";
import AboutCards from "./about/Cards";
import AboutStory from "./about/Story";
import SkillsGrid from "./skills/Grid";
import SkillsTabs from "./skills/Tabs";
import SkillsMarquee from "./skills/Marquee";
import ExperienceTimeline from "./experience/Timeline";
import ExperienceCards from "./experience/Cards";
import ProjectsGrid from "./projects/Grid";
import ProjectsList from "./projects/List";
import ProjectsCarousel from "./projects/Carousel";
import EducationTimeline from "./education/Timeline";
import EducationCards from "./education/Cards";
import CreativeCards from "./creative/Cards";
import CreativeShowcase from "./creative/Showcase";
import ContactSplit from "./contact/Split";
import ContactCentered from "./contact/Centered";

export const REGISTRY: Registry = {
  home: { classic: HomeClassic, centered: HomeCentered, split: HomeSplit, glitch: HomeGlitch },
  about: { cards: AboutCards, story: AboutStory },
  skills: { grid: SkillsGrid, tabs: SkillsTabs, marquee: SkillsMarquee },
  experience: { timeline: ExperienceTimeline, cards: ExperienceCards },
  projects: { grid: ProjectsGrid, list: ProjectsList, carousel: ProjectsCarousel },
  education: { timeline: EducationTimeline, cards: EducationCards },
  creative: { cards: CreativeCards, showcase: CreativeShowcase },
  contact: { split: ContactSplit, centered: ContactCentered },
};
