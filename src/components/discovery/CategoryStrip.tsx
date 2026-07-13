"use client";

interface Category {
  id: string;

  name: string;

  slug: string;

  count?: number;
}

interface Props {
  categories: Category[];

  active?: string;

  onSelect?: (
    slug: string,
  ) => void;
}

export default function CategoryStrip({
  categories,
  active,
  onSelect,
}: Props) {
  return (
    <section className="space-y-8">

      <div>

        <p className="text-xs uppercase tracking-[0.45em] text-gold">
          DISCOVER
        </p>

        <h2 className="mt-3 text-5xl font-black">
          Explore by Interest
        </h2>

        <p className="mt-4 max-w-3xl text-lg text-muted">
          Every category opens a new world of experiences.
        </p>

      </div>

      <div className="no-scrollbar flex gap-5 overflow-x-auto pb-2">

        {categories.map((category) => {
          const selected =
            active === category.slug;

          return (
            <button
              key={category.id}
              onClick={() =>
                onSelect?.(
                  category.slug,
                )
              }
              className={`group whitespace-nowrap rounded-full border px-8 py-4 text-sm font-medium transition-all duration-300 ${
                selected
                  ? "border-gold bg-gold text-black shadow-[0_10px_50px_rgba(212,175,55,.25)]"
                  : "border-divider bg-surface hover:border-gold/50 hover:bg-surface-hover"
              }`}
            >
              <div className="flex items-center gap-3">

                <span>
                  {category.name}
                </span>

                {category.count != null && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      selected
                        ? "bg-black/15"
                        : "bg-white/5"
                    }`}
                  >
                    {category.count}
                  </span>
                )}

              </div>

            </button>
          );
        })}

      </div>

    </section>
  );
}