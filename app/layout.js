import { Nunito } from "next/font/google";
import { SITE } from "../lib/constants";
import "./globals.css";

// Police des titres : SF Pro Rounded sur Apple, Nunito ailleurs (variable --font-display).
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
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
    <html lang="fr" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
