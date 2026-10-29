import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/cairo";
import "@fontsource-variable/noto-sans-sc";
import { justBreathe } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import ThemeCustomizer from "@/components/theme/ThemeCustomizer";
import AppBackground from "@/components/layout/AppBackground";
import { getContent } from "@/lib/content";
import "@/styles/theme.css";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "ar" }, { locale: "zh" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(locale);

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
        ar: "/ar",
        zh: "/zh",
      },
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
    },
  };
}

const themeInitScript = `
(function() {
  try {
    var raw = localStorage.getItem('portfolio-theme-v1');
    var theme = raw ? JSON.parse(raw) : null;
    var primary = theme && theme.primary ? theme.primary : '#6D5DF1';
    var mode = theme && theme.mode ? theme.mode : 'dark';
    var root = document.documentElement;
    var n = parseInt(primary.replace('#', '').padEnd(6, '0').slice(0, 6), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    root.style.setProperty('--primary', r + ' ' + g + ' ' + b);
    var fg = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '20 22 30' : '255 255 255';
    root.style.setProperty('--primary-fg', fg);
    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) { root.classList.add('dark'); } else { root.classList.remove('dark'); }
  } catch(e) {}
})();
`;

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const content = getContent(locale);
  const dir = content.meta.dir || "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={justBreathe.variable}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-bg font-sans text-fg antialiased selection:bg-primary/20 selection:text-primary min-h-screen relative">
        <ThemeProvider>
          <AppBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
            <ThemeCustomizer labels={content.theme as unknown as Record<string, string>} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
