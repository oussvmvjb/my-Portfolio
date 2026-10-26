import localFont from "next/font/local";

export const justBreathe = localFont({
  src: [
    { path: "../../public/fonts/JustBreathe-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/JustBreathe-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-breathe",
  display: "swap",
});
