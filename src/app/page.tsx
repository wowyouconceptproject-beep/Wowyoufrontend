import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { LegalFooter } from "@/components/legal";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050708] text-white">

      {/* Ambient background */}

      <div className="pointer-events-none absolute inset-0">

        <div
          className="
            absolute
            left-1/2
            top-1/3
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#3E86A4]/[0.08]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            bottom-[-250px]
            right-[-150px]
            h-[600px]
            w-[600px]
            rounded-full
            bg-white/[0.025]
            blur-[140px]
          "
        />

      </div>

      {/* Fine grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
          [background-size:80px_80px]
        "
      />

      {/* Header */}

      <header
        className="
          relative
          z-20
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-6
          py-7
          md:px-10
        "
      >

        <Link
          href="/"
          className="
            text-xl
            font-black
            tracking-[0.2em]
          "
        >
          WOWYOU
        </Link>

        <Link
          href="/login"
          className="
            text-sm
            font-medium
            text-white/60
            transition
            hover:text-white
          "
        >
          Organizer Login
        </Link>

      </header>

      {/* Hero */}

      <section
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-88px)]
          max-w-7xl
          flex-col
          justify-between
          px-6
          pb-10
          pt-20
          md:px-10
          md:pb-14
          lg:pt-24
        "
      >

        {/* Hero copy */}

        <div className="max-w-6xl">

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.42em]
              text-[#14B8A6]
            "
          >
            Discover. Experience. Connect.
          </p>

          <h1
            className="
              mt-7
              max-w-5xl
              text-[clamp(4rem,9vw,9rem)]
              font-black
              leading-[0.84]
              tracking-[-0.065em]
            "
          >
            Experiences
            <br />
            at your
            <br />

            <span className="text-[#14B8A6]">
              fingertips.
            </span>

          </h1>

          <p
            className="
              mt-10
              max-w-xl
              text-lg
              leading-8
              text-white/55
              md:text-xl
            "
          >
            See what&apos;s happening
            around you today — or create
            an experience of your own.
          </p>

        </div>

        {/* Actions */}

        <div
          className="
            mt-16
            flex
            flex-col
            gap-4
            border-t
            border-white/10
            pt-8
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/discover"
              className="
                group
                inline-flex
                min-w-[190px]
                items-center
                justify-between
                gap-8
                rounded-full
                bg-[#3E86A4]
                px-7
                py-4
                font-semibold
                text-white
                transition
                duration-300
                hover:scale-[1.02]
                hover:bg-[#1F7197]
              "
            >
              Discover

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  group-hover:translate-x-1
                "
              />

            </Link>

            <Link
              href="/register"
              className="
                group
                inline-flex
                min-w-[240px]
                items-center
                justify-between
                gap-8
                rounded-full
                border
                border-white/15
                bg-white/[0.03]
                px-7
                py-4
                font-semibold
                backdrop-blur
                transition
                duration-300
                hover:border-white/30
                hover:bg-white/[0.07]
              "
            >
              Organize Your Event

              <CalendarDays
                className="
                  h-4
                  w-4
                  text-[#14B8A6]
                "
              />

            </Link>

          </div>

          <p
            className="
              hidden
              max-w-[220px]
              text-right
              text-xs
              leading-5
              text-white/35
              lg:block
            "
          >
            Wowyou Event Tech- Events, people and
            experiences — connected
            through one platform.
          </p>

        </div>

      </section>

      {/* Legal Footer */}

      <LegalFooter />

    </main>
  );
}