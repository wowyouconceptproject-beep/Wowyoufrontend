"use client";

import { useRouter } from "next/navigation";

interface Category {
  id?: string;

  name?: string;

  slug?: string;

  count?: number;

  // Backend discovery format
  category?: string | null;

  totalEvents?: number;
}

interface Props {
  categories: Category[];

  active?: string;

  onSelect?: (
    slug: string,
  ) => void;
}

function createSlug(
  value: string,
) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryStrip({
  categories,
  active,
  onSelect,
}: Props) {
  const router =
    useRouter();

  function handleSelect(
    slug: string,
  ) {
    /*
    |--------------------------------------------------------------------------
    | Controlled Mode
    |--------------------------------------------------------------------------
    |
    | If the discovery page provides onSelect,
    | allow the parent to control filtering.
    |
    */

    if (onSelect) {
      onSelect(slug);

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Navigation Mode
    |--------------------------------------------------------------------------
    |
    | Otherwise update the discovery URL.
    |
    */

    router.push(
      `/discover?category=${encodeURIComponent(
        slug,
      )}`,
    );
  }

  if (!categories?.length) {
    return null;
  }

  return (
    <section className="space-y-8">

      {/* Header */}

      <div>

        <div className="flex items-center gap-3">

          <span className="h-px w-10 bg-gold" />

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.45em]
              text-gold
            "
          >
            Explore
          </p>

        </div>

        <h2
          className="
            mt-4
            max-w-3xl
            text-4xl
            font-black
            tracking-tight
            sm:text-5xl
          "
        >
          Explore by Interest
        </h2>

        <p
          className="
            mt-4
            max-w-2xl
            text-base
            leading-7
            text-muted
            sm:text-lg
          "
        >
          Find experiences built
          around what interests you.
        </p>

      </div>

      {/* Categories */}

      <div
        className="
          no-scrollbar
          flex
          gap-3
          overflow-x-auto
          pb-3
        "
      >

        {categories.map(
          (
            category,
            index,
          ) => {

            /*
            |--------------------------------------------------------------------------
            | Normalize Category
            |--------------------------------------------------------------------------
            */

            const name =
              category.name ??
              category.category ??
              "";

            if (!name) {
              return null;
            }

            const slug =
              category.slug ??
              createSlug(name);

            const count =
              category.count ??
              category.totalEvents;

            const selected =
              active === slug;

            return (
              <button
                key={
                  category.id ??
                  slug ??
                  index
                }
                type="button"
                onClick={() =>
                  handleSelect(
                    slug,
                  )
                }
                className={`
                  group
                  shrink-0
                  whitespace-nowrap
                  rounded-full
                  border
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  sm:px-7

                  ${
                    selected
                      ? `
                        border-gold
                        bg-gold
                        text-white
                        shadow-[0_12px_40px_rgba(212,175,55,0.18)]
                      `
                      : `
                        border-divider
                        bg-surface
                        text-foreground
                        hover:border-gold/50
                        hover:bg-surface-hover
                      `
                  }
                `}
              >

                <span className="flex items-center gap-3">

                  <span>
                    {name}
                  </span>

                  {count != null && (
                    <span
                      className={`
                        flex
                        min-w-6
                        items-center
                        justify-center
                        rounded-full
                        px-2
                        py-0.5
                        text-[11px]
                        font-bold

                        ${
                          selected
                            ? `
                              bg-black/10
                              text-white/70
                            `
                            : `
                              bg-white/5
                              text-muted
                              group-hover:text-foreground
                            `
                        }
                      `}
                    >
                      {count}
                    </span>
                  )}

                </span>

              </button>
            );
          },
        )}

      </div>

    </section>
  );
}