import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-white">

      {/* Ambient brand glow */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3E86A4]/[0.06] blur-[120px]" />

      {/* Decorative lines */}

      <div className="absolute left-0 top-1/2 h-px w-[18%] bg-gradient-to-r from-transparent to-[#D4AF37]/20" />

      <div className="absolute right-0 top-1/2 h-px w-[18%] bg-gradient-to-l from-transparent to-[#D4AF37]/20" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">

        {/* Brand */}

        <div className="mb-10 flex items-center justify-center gap-3">

          <div className="h-px w-8 bg-[#3E86A4]" />

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#3E86A4]">
            WOWYOU
          </p>

          <div className="h-px w-8 bg-[#3E86A4]" />

        </div>

        {/* 404 */}

        <p className="select-none text-[110px] font-black leading-none tracking-[-0.07em] text-white/[0.06] sm:text-[150px] md:text-[190px]">
          404
        </p>

        {/* Message */}

        <div className="-mt-8 sm:-mt-12">

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#3E86A4]">
            Experience Unavailable
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Event Not Found
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/45">
            The event you&apos;re looking for
            doesn&apos;t exist, has been removed,
            or is no longer publicly available.
          </p>

        </div>

        {/* Action */}

        <div className="mt-10">

          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-[#3E86A4] px-8 py-4 text-sm font-bold text-white transition duration-300 hover:bg-[#1F7197]"
          >
            <span>
              Back to Discovery
            </span>

            <span aria-hidden="true">
              →
            </span>
          </Link>

        </div>

        {/* Footer brand */}

        <p className="mt-16 text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">
          Discover · Connect · Experience
        </p>

      </div>

    </main>
  );
}