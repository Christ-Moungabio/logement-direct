import { Nunito } from "next/font/google";
import { SITE } from "../lib/constants";
import "./globals.css";
import Link from "next/link";

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
<<<<<<< HEAD
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>  <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 24px', background:'white', borderBottom:'1px solid #eee', position:'sticky', top:0, zIndex:50}}>
          <Link href="/" style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'bold', fontSize:'20px', color:'#0B1F4A', textDecoration:'none'}}>
            <div style={{width:32, height:32, background:'#0B1F4A', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>⌂</div>
            Ndako
          </Link>

          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <Link href="/recherche" style={{background:'#f3f4f6', padding:'8px 16px', borderRadius:20, fontSize:'14px', textDecoration:'none', color:'black'}}>
              Brazzaville - Studio, Appartement
            </Link>
            <button style={{border:'none', background:'none', fontSize:'14px', cursor:'pointer'}}>Connexion</button>
            <button style={{background:'black', color:'white', padding:'8px 16px', borderRadius:20, border:'none', fontSize:'14px', cursor:'pointer'}}>Créer un compte</button>
          </div>
        </header>
        {children}</body>
=======
    <html lang="fr" className={nunito.variable}>
      <body>{children}</body>
>>>>>>> origin/dev
    </html>
  );
}
