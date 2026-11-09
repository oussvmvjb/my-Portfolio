import { getContent } from '@/lib/content';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function ProjectsLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const content = getContent(locale);

  return (
    <>
      <Navbar
        nav={content.nav}
        person={content.person}
        currentLocale={locale}
      />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer footer={content.footer} person={content.person} />
    </>
  );
}

