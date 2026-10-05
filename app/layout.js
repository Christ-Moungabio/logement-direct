import { Plus_Jakarta_Sans } from "next/font/google";
import { SITE } from "../lib/constants";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: {
    default: `${SITE.name} — Logements à louer au Congo-Brazzaville`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={jakarta.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
