import React from 'react';
import type { LogoItem } from '@/components/ui/LogoLoop';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiAngular,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiSpringboot,
  SiFastapi,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiFlutter,
  SiKotlin,
  SiAndroid,
  SiApple,
  SiDocker,
  SiFirebase,
  SiGit,
  SiGithub,
  SiGitlab,
  SiLinux,
  SiJira,
  SiFigma,
  SiBlender,
  SiAudacity
} from 'react-icons/si';
import { Palette, Film, Video, Music, Layers, Terminal, Smartphone, GitBranch, Sparkles } from 'lucide-react';

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  frontend: Layers,
  backend: Terminal,
  mobile: Smartphone,
  devops: GitBranch,
  design: Palette,
};

export const CATEGORY_LOGOS: Record<string, LogoItem[]> = {
  frontend: [
    { node: <SiReact />, title: 'React', href: 'https://react.dev', hoverColor: '#61dafb' },
    { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org', hoverColor: '#ffffff' },
    { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org', hoverColor: '#3178c6' },
    { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#38bdf8' },
    { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', hoverColor: '#f7df1e' },
    { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML', hoverColor: '#e34f26' },
    { node: <SiCss />, title: 'CSS3', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS', hoverColor: '#1572b6' },
    { node: <SiAngular />, title: 'Angular', href: 'https://angular.dev', hoverColor: '#dd0031' },
  ],
  backend: [
    { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org', hoverColor: '#5fa04e' },
    { node: <SiPython />, title: 'Python', href: 'https://www.python.org', hoverColor: '#3776ab' },
    { node: <SiNestjs />, title: 'NestJS', href: 'https://nestjs.com', hoverColor: '#e0234e' },
    { node: <SiSpringboot />, title: 'Spring Boot', href: 'https://spring.io/projects/spring-boot', hoverColor: '#6db33f' },
    { node: <SiExpress />, title: 'Express.js', href: 'https://expressjs.com', hoverColor: '#ffffff' },
    { node: <SiFastapi />, title: 'FastAPI', href: 'https://fastapi.tiangolo.com', hoverColor: '#009688' },
    { node: <SiPostgresql />, title: 'PostgreSQL', href: 'https://www.postgresql.org', hoverColor: '#4169e1' },
    { node: <SiMongodb />, title: 'MongoDB', href: 'https://www.mongodb.com', hoverColor: '#47a248' },
    { node: <SiMysql />, title: 'MySQL', href: 'https://www.mysql.com', hoverColor: '#4479a1' },
  ],
  mobile: [
    { node: <SiReact />, title: 'React Native', href: 'https://reactnative.dev', hoverColor: '#61dafb' },
    { node: <SiFlutter />, title: 'Flutter', href: 'https://flutter.dev', hoverColor: '#02569b' },
    { node: <SiKotlin />, title: 'Kotlin', href: 'https://kotlinlang.org', hoverColor: '#7f52ff' },
    { node: <SiAndroid />, title: 'Android', href: 'https://developer.android.com', hoverColor: '#3ddc84' },
    { node: <SiApple />, title: 'iOS', href: 'https://developer.apple.com/swift', hoverColor: '#ffffff' },
  ],
  devops: [
    { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com', hoverColor: '#2496ed' },
    { node: <SiFirebase />, title: 'Firebase', href: 'https://firebase.google.com', hoverColor: '#ffca28' },
    { node: <SiGit />, title: 'Git', href: 'https://git-scm.com', hoverColor: '#f05032' },
    { node: <SiGithub />, title: 'GitHub', href: 'https://github.com', hoverColor: '#ffffff' },
    { node: <SiGitlab />, title: 'GitLab', href: 'https://gitlab.com', hoverColor: '#fc6d26' },
    { node: <SiLinux />, title: 'Linux', href: 'https://kernel.org', hoverColor: '#fcc624' },
    { node: <SiJira />, title: 'Agile & Jira', href: 'https://www.atlassian.com/software/jira', hoverColor: '#0052cc' },
  ],
  design: [
    { node: <SiFigma />, title: 'Figma', href: 'https://www.figma.com', hoverColor: '#f24e1e' },
    { node: <Palette className="size-full" />, title: 'UI/UX Design', hoverColor: '#a855f7' },
    { node: <Palette className="size-full" />, title: 'Adobe Illustrator', hoverColor: '#ff9a00' },
    { node: <Film className="size-full" />, title: 'Adobe Premiere Pro', hoverColor: '#9999ff' },
    { node: <Video className="size-full" />, title: 'CapCut Pro', hoverColor: '#00f2fe' },
    { node: <Music className="size-full" />, title: 'FL Studio', hoverColor: '#ff8300' },
    { node: <SiBlender />, title: 'Blender', href: 'https://www.blender.org', hoverColor: '#ea7600' },
    { node: <SiAudacity />, title: 'Audacity', href: 'https://www.audacityteam.org', hoverColor: '#0000eb' },
  ],
};

const KNOWN_MAP: Record<string, LogoItem> = {
  react: { node: <SiReact />, title: 'React', href: 'https://react.dev', hoverColor: '#61dafb' },
  'next.js': { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org', hoverColor: '#ffffff' },
  nextjs: { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org', hoverColor: '#ffffff' },
  typescript: { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org', hoverColor: '#3178c6' },
  'tailwind css': { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#38bdf8' },
  tailwind: { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#38bdf8' },
  angular: { node: <SiAngular />, title: 'Angular', href: 'https://angular.dev', hoverColor: '#dd0031' },
  javascript: { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', hoverColor: '#f7df1e' },
  html5: { node: <SiHtml5 />, title: 'HTML5', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML', hoverColor: '#e34f26' },
  css3: { node: <SiCss />, title: 'CSS3', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS', hoverColor: '#1572b6' },

  'node.js': { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org', hoverColor: '#5fa04e' },
  nodejs: { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org', hoverColor: '#5fa04e' },
  python: { node: <SiPython />, title: 'Python', href: 'https://www.python.org', hoverColor: '#3776ab' },
  nestjs: { node: <SiNestjs />, title: 'NestJS', href: 'https://nestjs.com', hoverColor: '#e0234e' },
  'spring boot': { node: <SiSpringboot />, title: 'Spring Boot', href: 'https://spring.io/projects/spring-boot', hoverColor: '#6db33f' },
  'express.js': { node: <SiExpress />, title: 'Express.js', href: 'https://expressjs.com', hoverColor: '#ffffff' },
  express: { node: <SiExpress />, title: 'Express.js', href: 'https://expressjs.com', hoverColor: '#ffffff' },
  fastapi: { node: <SiFastapi />, title: 'FastAPI', href: 'https://fastapi.tiangolo.com', hoverColor: '#009688' },
  postgresql: { node: <SiPostgresql />, title: 'PostgreSQL', href: 'https://www.postgresql.org', hoverColor: '#4169e1' },
  mongodb: { node: <SiMongodb />, title: 'MongoDB', href: 'https://www.mongodb.com', hoverColor: '#47a248' },
  mysql: { node: <SiMysql />, title: 'MySQL', href: 'https://www.mysql.com', hoverColor: '#4479a1' },

  'react native': { node: <SiReact />, title: 'React Native', href: 'https://reactnative.dev', hoverColor: '#61dafb' },
  flutter: { node: <SiFlutter />, title: 'Flutter', href: 'https://flutter.dev', hoverColor: '#02569b' },
  'flutter (basics)': { node: <SiFlutter />, title: 'Flutter', href: 'https://flutter.dev', hoverColor: '#02569b' },
  kotlin: { node: <SiKotlin />, title: 'Kotlin', href: 'https://kotlinlang.org', hoverColor: '#7f52ff' },
  android: { node: <SiAndroid />, title: 'Android', href: 'https://developer.android.com', hoverColor: '#3ddc84' },

  docker: { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com', hoverColor: '#2496ed' },
  firebase: { node: <SiFirebase />, title: 'Firebase', href: 'https://firebase.google.com', hoverColor: '#ffca28' },
  'git & github': { node: <SiGit />, title: 'Git & GitHub', href: 'https://github.com', hoverColor: '#f05032' },
  git: { node: <SiGit />, title: 'Git', href: 'https://git-scm.com', hoverColor: '#f05032' },
  github: { node: <SiGithub />, title: 'GitHub', href: 'https://github.com', hoverColor: '#ffffff' },
  gitlab: { node: <SiGitlab />, title: 'GitLab', href: 'https://gitlab.com', hoverColor: '#fc6d26' },
  agile: { node: <SiJira />, title: 'Agile & Scrum', href: 'https://www.atlassian.com/agile', hoverColor: '#0052cc' },
  linux: { node: <SiLinux />, title: 'Linux', href: 'https://kernel.org', hoverColor: '#fcc624' },

  figma: { node: <SiFigma />, title: 'Figma', href: 'https://www.figma.com', hoverColor: '#f24e1e' },
  'ui/ux basics': { node: <Palette className="size-full" />, title: 'UI/UX Design', hoverColor: '#a855f7' },
  'ui/ux': { node: <Palette className="size-full" />, title: 'UI/UX Design', hoverColor: '#a855f7' },
  'adobe illustrator': { node: <Palette className="size-full" />, title: 'Illustrator', hoverColor: '#ff9a00' },
  'adobe premiere pro': { node: <Film className="size-full" />, title: 'Premiere Pro', hoverColor: '#9999ff' },
  'capcut pro': { node: <Video className="size-full" />, title: 'CapCut Pro', hoverColor: '#00f2fe' },
  'fl studio': { node: <Music className="size-full" />, title: 'FL Studio', hoverColor: '#ff8300' },
};

export function getLogosForGroup(groupId: string, items?: string[]): LogoItem[] {
  const fallback = CATEGORY_LOGOS[groupId] || CATEGORY_LOGOS.frontend;
  if (!items || items.length === 0) return fallback;

  const resolved: LogoItem[] = [];
  const seen = new Set<string>();

  items.forEach((item) => {
    const key = item.toLowerCase().trim();
    const match = KNOWN_MAP[key];
    if (match && !seen.has(match.title || key)) {
      seen.add(match.title || key);
      resolved.push(match);
    }
  });

  // supplement with fallback list so the loop is always rich and smooth
  fallback.forEach((item) => {
    const title = item.title || '';
    if (!seen.has(title)) {
      seen.add(title);
      resolved.push(item);
    }
  });

  return resolved;
}

export const allTechLogos: LogoItem[] = Object.values(CATEGORY_LOGOS).flat();

