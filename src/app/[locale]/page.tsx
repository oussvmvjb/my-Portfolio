import { getContent } from "@/lib/content";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionRenderer from "@/components/sections/SectionRenderer";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
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
        <SectionRenderer content={content} />
      </main>
      <Footer
        footer={content.footer}
        person={content.person}
      />
    </>
  );
}
