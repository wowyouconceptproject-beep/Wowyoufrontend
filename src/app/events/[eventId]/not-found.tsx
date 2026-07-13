import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center">

      <div className="text-center">

        <h1 className="text-5xl font-black">

          Event Not Found

        </h1>

        <p className="mt-4 text-muted">

          The event you're looking for doesn't exist.

        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-gold px-8 py-4 font-semibold text-black"
        >
          Back to Discovery
        </Link>

      </div>

    </main>
  );
}