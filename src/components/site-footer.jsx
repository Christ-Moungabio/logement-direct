export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex w-full max-w-page flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Ndako · Logements à louer, sans intermédiaire payant</p>
        <p>© {new Date().getFullYear()} Ndako · Congo-Brazzaville</p>
      </div>
    </footer>
  );
}
