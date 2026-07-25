import { Suspense } from "react";

import SearchPageContent from "./SearchPageContent";

function SearchLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded-full bg-surface" />

          <div className="mt-5 h-12 max-w-xl rounded-xl bg-surface" />

          <div className="mt-4 h-5 max-w-md rounded-lg bg-surface" />

          <div className="mt-12 h-16 w-full rounded-2xl bg-surface" />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-80 rounded-[28px] bg-surface"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <SearchLoading />
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}