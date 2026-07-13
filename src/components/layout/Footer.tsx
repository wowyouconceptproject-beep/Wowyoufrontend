import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-40 border-t border-divider">

      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-4">

        {/* Brand */}

        <div>

          <h2 className="text-3xl font-black tracking-[0.2em]">

            WOWYOU

          </h2>

          <p className="mt-6 leading-8 text-muted">

            Discover extraordinary experiences.

            Buy tickets.

            Connect with organizers.

            Grow your business as a vendor.

          </p>

        </div>

        {/* Discover */}

        <div>

          <h3 className="font-semibold">

            Discover

          </h3>

          <div className="mt-6 flex flex-col gap-4 text-muted">

            <Link href="/discover">
              Discover Events
            </Link>

            <Link href="/events">
              Browse Events
            </Link>

            <Link href="/categories">
              Categories
            </Link>

          </div>

        </div>

        {/* Community */}

        <div>

          <h3 className="font-semibold">

            Community

          </h3>

          <div className="mt-6 flex flex-col gap-4 text-muted">

            <Link href="/organizers">
              Become an Organizer
            </Link>

            <Link href="/vendors">
              Become a Vendor
            </Link>

            <Link href="/download">
              Download App
            </Link>

          </div>

        </div>

        {/* Company */}

        <div>

          <h3 className="font-semibold">

            Company

          </h3>

          <div className="mt-6 flex flex-col gap-4 text-muted">

            <Link href="/about">
              About
            </Link>

            <Link href="/privacy">
              Privacy Policy
            </Link>

            <Link href="/terms">
              Terms of Service
            </Link>

          </div>

        </div>

      </div>

      <div className="border-t border-divider">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 text-sm text-muted md:flex-row">

          <p>

            © {new Date().getFullYear()} WowYou. All rights reserved.

          </p>

          <p>

            Built for unforgettable experiences.

          </p>

        </div>

      </div>

    </footer>
  );
}