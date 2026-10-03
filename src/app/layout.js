import { Nunito_Sans } from "next/font/google";

import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Logement Direct · Logements à louer à Brazzaville",
    template: "%s · Logement Direct",
  },
  description:
    "Trouvez un logement à louer à Brazzaville et contactez directement le propriétaire, sans intermédiaire payant.",
};

export const viewport = {
  themeColor: "#1d4ed8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={nunitoSans.variable}>
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  );
}
