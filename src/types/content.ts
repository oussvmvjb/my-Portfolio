export interface MetaContent {
  locale: string;
  dir: "ltr" | "rtl";
  title: string;
  description: string;
}

export interface PersonContent {
  name: string;
  role: string;
  email: string;
  phones: string[];
  location: string;
  socials: {
    github?: string;
    gitlab?: string;
    linkedin?: string;
    instagram?: string;
    tiktok?: string;
    [key: string]: string | undefined;
  };
}

export interface NavContent {
  home: string;
  about: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
  creative: string;
  contact: string;
  language: string;
  theme: string;
}

export interface HeroContent {
  greeting: string;
  name: string;
  role: string;
  typedRoles: string[];
  tagline: string;
  status: string;
  cta: {
    primary: string;
    secondary: string;
    cv: string;
  };
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
  facts: Array<{
    label: string;
    value: string;
  }>;
  softSkills: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export interface SkillsContent {
  title: string;
  subtitle: string;
  groups: SkillGroup[];
  currentGoals: {
    title: string;
    items: string[];
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface ExperienceContent {
  title: string;
  subtitle: string;
  items: ExperienceItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string[];
  featured: boolean;
  description: string;
  tech: string[];
  github: string;
  live: string;
}

export interface ProjectsContent {
  title: string;
  subtitle: string;
  filters: Record<string, string>;
  labels: {
    code: string;
    live: string;
    featured: string;
  };
  items: ProjectItem[];
  seeMore: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  period: string;
  status: string;
  details: string[];
}

export interface EducationContent {
  title: string;
  items: EducationItem[];
}

export interface CreativeItem {
  id: string;
  title: string;
  tools: string[];
  points: string[];
}

export interface CreativeContent {
  title: string;
  subtitle: string;
  intro: string;
  items: CreativeItem[];
}

export interface LanguageItem {
  name: string;
  level: string;
  percent: number;
}

export interface LanguagesContent {
  title: string;
  items: LanguageItem[];
}

export interface ActivitiesContent {
  title: string;
  items: string[];
}

export interface ContactContent {
  title: string;
  subtitle: string;
  form: {
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    validation: {
      required: string;
      email: string;
    };
  };
  info: {
    email: string;
    phone: string;
    location: string;
  };
}

export interface FooterContent {
  rights: string;
  built: string;
  backToTop: string;
}

export interface ThemeContent {
  open: string;
  title: string;
  subtitle: string;
  theming: string;
  sections: string;
  primary: string;
  mode: string;
  light: string;
  dark: string;
  system: string;
  reset: string;
  close: string;
}

export interface NotFoundContent {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
}

export interface Content {
  meta: MetaContent;
  person: PersonContent;
  nav: NavContent;
  hero: HeroContent;
  about: AboutContent;
  skills: SkillsContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
  education: EducationContent;
  creative: CreativeContent;
  languages: LanguagesContent;
  activities: ActivitiesContent;
  contact: ContactContent;
  footer: FooterContent;
  theme: ThemeContent;
  notFound: NotFoundContent;
}

export type Locale = "en" | "fr" | "ar" | "zh";
