import { getContent } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectDetailsClient from '@/components/sections/projects/ProjectDetailsClient';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

const LOCALES = ['en', 'fr', 'ar', 'zh'] as const;

export function generateStaticParams() {
  const en = getContent('en');
  const projectIds = en.projects.items.map((p) => p.id);
  return LOCALES.flatMap((locale) =>
    projectIds.map((id) => ({ locale, id }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const content = getContent(locale);
  const project = content.projects.items.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.title} — ${content.meta.title}`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const content = getContent(locale);
  const projectIndex = content.projects.items.findIndex((p) => p.id === id);

  if (projectIndex === -1) notFound();

  const project = content.projects.items[projectIndex];
  const prevProject = projectIndex > 0 ? content.projects.items[projectIndex - 1] : null;
  const nextProject =
    projectIndex < content.projects.items.length - 1
      ? content.projects.items[projectIndex + 1]
      : null;

  return (
    <ProjectDetailsClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
      locale={locale}
    />
  );
}

