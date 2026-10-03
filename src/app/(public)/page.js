import Link from "next/link";

// Page d'accueil provisoire : elle sera remplacée par le module REC (recherche).
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-1 flex-col items-start justify-center gap-4 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Logement Direct
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Trouvez un logement à louer à Brazzaville, directement auprès des
        propriétaires.
      </p>
      <Link
        href="/connexion"
        className="font-semibold text-primary underline-offset-4 hover:underline"
      >
        Se connecter
      </Link>
    </main>
  );
}
