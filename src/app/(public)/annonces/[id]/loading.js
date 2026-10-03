// Squelette affiché pendant le chargement de la fiche.
export default function ListingLoading() {
  return (
    <div
      className="mx-auto w-full max-w-page animate-pulse px-4 py-6 sm:px-6 sm:py-8"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Chargement de l&apos;annonce…</span>
      <div className="mb-4 h-4 w-48 rounded bg-muted" />
      <div className="-mx-4 aspect-[4/3] bg-muted sm:mx-0 sm:rounded-xl md:aspect-auto md:h-[min(30rem,42vw)]" />
      <div className="mt-6 h-8 w-2/3 rounded bg-muted" />
      <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <div className="flex flex-col gap-4">
          <div className="h-10 w-56 rounded bg-muted" />
          <div className="h-5 w-80 max-w-full rounded bg-muted" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((key) => (
              <div key={key} className="h-16 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
        <div className="hidden h-56 rounded-xl bg-muted lg:block" />
      </div>
    </div>
  );
}
