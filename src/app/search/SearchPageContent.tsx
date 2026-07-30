"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Loader2,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";

import {
  getSearchSuggestions,
  SearchEvent,
  SearchSuggestion,
  searchEvents,
} from "@/services/search";

export default function SearchPageContent() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const query =
    searchParams
      .get("q")
      ?.trim() ?? "";

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [
    search,
    setSearch,
  ] = useState(query);

  const [
    events,
    setEvents,
  ] = useState<SearchEvent[]>(
    [],
  );

  const [
    suggestions,
    setSuggestions,
  ] = useState<
    SearchSuggestion[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    suggestionsLoading,
    setSuggestionsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    suggestionsOpen,
    setSuggestionsOpen,
  ] = useState(false);

  const [
    activeSuggestion,
    setActiveSuggestion,
  ] = useState(-1);

  const searchContainerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const suggestionRequestRef =
    useRef(0);

  /*
  |--------------------------------------------------------------------------
  | Sync URL Query
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setSearch(query);
  }, [query]);

  /*
  |--------------------------------------------------------------------------
  | Load Search Results
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!query) {
        setEvents([]);
        setError("");
        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        setError("");

        const result =
          await searchEvents(
            query,
          );

        if (cancelled) {
          return;
        }

        if (
          result.success !== true
        ) {
          setEvents([]);

          setError(
            result.message ??
              "Unable to search events.",
          );

          return;
        }

        setEvents(
          result.events ?? [],
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "SEARCH PAGE ERROR:",
          error,
        );

        setEvents([]);

        setError(
          "Unable to search events right now.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [query]);

  /*
  |--------------------------------------------------------------------------
  | Suggestions
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const value =
      search.trim();

    if (
      !value ||
      value === query
    ) {
      setSuggestions([]);
      setSuggestionsLoading(
        false,
      );
      setActiveSuggestion(-1);

      return;
    }

    if (value.length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(
        false,
      );
      setActiveSuggestion(-1);

      return;
    }

    const requestId =
      ++suggestionRequestRef.current;

    const timer =
      window.setTimeout(
        async () => {
          try {
            setSuggestionsLoading(
              true,
            );

            const result =
              await getSearchSuggestions(
                value,
              );

            if (
              requestId !==
              suggestionRequestRef.current
            ) {
              return;
            }

            if (
              result.success
            ) {
              setSuggestions(
                result.suggestions ??
                  [],
              );

              setSuggestionsOpen(
                true,
              );

              setActiveSuggestion(
                -1,
              );
            } else {
              setSuggestions([]);
            }
          } finally {
            if (
              requestId ===
              suggestionRequestRef.current
            ) {
              setSuggestionsLoading(
                false,
              );
            }
          }
        },
        300,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [search, query]);

  /*
  |--------------------------------------------------------------------------
  | Close Suggestions When Clicking Outside
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        searchContainerRef
          .current &&
        !searchContainerRef.current.contains(
          event.target as Node,
        )
      ) {
        setSuggestionsOpen(
          false,
        );

        setActiveSuggestion(
          -1,
        );
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search Submission
  |--------------------------------------------------------------------------
  */

  function submit(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    const value =
      search.trim();

    if (!value) {
      return;
    }

    setSuggestionsOpen(
      false,
    );

    setSuggestions([]);

    setActiveSuggestion(-1);

    router.push(
      `/search?q=${encodeURIComponent(
        value,
      )}`,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Select Suggestion
  |--------------------------------------------------------------------------
  */

  function selectSuggestion(
    suggestion: SearchSuggestion,
  ) {
    setSuggestionsOpen(
      false,
    );

    setSuggestions([]);

    setActiveSuggestion(-1);

    /*
    |--------------------------------------------------------------------------
    | Event
    |--------------------------------------------------------------------------
    */

    if (
      suggestion.type ===
      "event"
    ) {
      router.push(
        `/events/${suggestion.id}`,
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Organization
    |--------------------------------------------------------------------------
    |
    | Backend currently exposes organization suggestions but there is no
    | organization public route in the supplied contract.
    |
    | Therefore an organization suggestion becomes a global search query.
    |--------------------------------------------------------------------------
    */

    setSearch(
      suggestion.title,
    );

    router.push(
      `/search?q=${encodeURIComponent(
        suggestion.title,
      )}`,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Keyboard Navigation
  |--------------------------------------------------------------------------
  */

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      !suggestionsOpen ||
      suggestions.length === 0
    ) {
      if (
        event.key ===
          "Enter" &&
        search.trim()
      ) {
        return;
      }

      return;
    }

    if (
      event.key ===
      "ArrowDown"
    ) {
      event.preventDefault();

      setActiveSuggestion(
        (previous) => {
          if (
            previous >=
            suggestions.length -
              1
          ) {
            return 0;
          }

          return previous + 1;
        },
      );

      return;
    }

    if (
      event.key ===
      "ArrowUp"
    ) {
      event.preventDefault();

      setActiveSuggestion(
        (previous) => {
          if (
            previous <= 0
          ) {
            return (
              suggestions.length -
              1
            );
          }

          return previous - 1;
        },
      );

      return;
    }

    if (
      event.key ===
      "Enter" &&
      activeSuggestion >= 0
    ) {
      event.preventDefault();

      selectSuggestion(
        suggestions[
          activeSuggestion
        ],
      );

      return;
    }

    if (
      event.key ===
      "Escape"
    ) {
      setSuggestionsOpen(
        false,
      );

      setActiveSuggestion(
        -1,
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Clear Search
  |--------------------------------------------------------------------------
  */

  function clearSearch() {
    setSearch("");

    setSuggestions([]);

    setSuggestionsOpen(
      false,
    );

    setActiveSuggestion(-1);
  }

  /*
  |--------------------------------------------------------------------------
  | Date
  |--------------------------------------------------------------------------
  */

  function formatDate(
    value: string,
  ) {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    ).format(date);
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main
      className="
        min-h-screen
        bg-background
        text-foreground
      "
    >

      {/* Navigation */}

      <header
        className="
          border-b
          border-divider
          bg-background/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-6
            py-6
            sm:px-8
          "
        >

          <Link
            href="/discover"
            className="
              group
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-muted
              transition
              hover:text-foreground
            "
          >
            <ArrowLeft
              className="
                h-4
                w-4
                transition
                group-hover:-translate-x-1
              "
            />

            Discovery
          </Link>

          <Link
            href="/"
            className="
              text-sm
              font-black
              tracking-[0.22em]
              text-gold
            "
          >
            WOWYOU
          </Link>

        </div>
      </header>

      {/* Hero */}

      <section
        className="
          relative
          overflow-visible
          border-b
          border-divider
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-[500px]
            w-[800px]
            -translate-x-1/2
            rounded-full
            bg-gold/5
            blur-[140px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-6
            py-16
            sm:px-8
            lg:py-24
          "
        >

          <div className="max-w-4xl">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.4em]
                text-gold
              "
            >
              Discover
            </p>

            <h1
              className="
                mt-5
                max-w-4xl
                text-4xl
                font-black
                leading-[1.05]
                tracking-tight
                sm:text-5xl
                lg:text-7xl
              "
            >
              Find your next
              experience.
            </h1>

            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-8
                text-muted
                sm:text-lg
              "
            >
              Search events,
              experiences, venues and
              organizers happening
              around you.
            </p>

          </div>

          {/* Search */}

          <div
            ref={
              searchContainerRef
            }
            className="
              relative
              z-30
              mt-10
              max-w-4xl
            "
          >

            <form
              onSubmit={submit}
              className="
                flex
                items-center
                rounded-[24px]
                border
                border-divider
                bg-surface
                p-2
                shadow-2xl
                shadow-black/5
                transition
                focus-within:border-gold/50
              "
            >

              <Search
                className="
                  ml-4
                  h-5
                  w-5
                  shrink-0
                  text-muted
                "
              />

              <input
                type="text"
                value={search}
                autoComplete="off"
                aria-label="Search events"
                placeholder="Search events, venues or experiences..."
                onFocus={() => {
                  if (
                    suggestions.length >
                    0
                  ) {
                    setSuggestionsOpen(
                      true,
                    );
                  }
                }}
                onKeyDown={
                  handleKeyDown
                }
                onChange={(
                  event,
                ) => {
                  setSearch(
                    event.target
                      .value,
                  );

                  setActiveSuggestion(
                    -1,
                  );
                }}
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-4
                  py-4
                  text-base
                  text-foreground
                  outline-none
                  placeholder:text-muted
                  sm:text-lg
                "
              />

              {suggestionsLoading && (
                <Loader2
                  className="
                    mr-2
                    h-5
                    w-5
                    animate-spin
                    text-muted
                  "
                />
              )}

              {search &&
                !suggestionsLoading && (
                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                    aria-label="Clear search"
                    className="
                      mr-2
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      text-muted
                      transition
                      hover:bg-surface-hover
                      hover:text-foreground
                    "
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

              <button
                type="submit"
                disabled={
                  !search.trim()
                }
                className="
                  hidden
                  shrink-0
                  rounded-[18px]
                  bg-gold
                  px-7
                  py-4
                  font-bold
                  text-white
                  transition
                  hover:scale-[1.02]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  sm:inline-flex
                "
              >
                Search
              </button>

            </form>

            {/* Suggestions */}

            {suggestionsOpen &&
              search.trim()
                .length >= 2 && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-[calc(100%+12px)]
                    z-50
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-divider
                    bg-surface
                    shadow-2xl
                  "
                >

                  {suggestionsLoading &&
                    suggestions
                      .length === 0 && (
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          px-6
                          py-5
                          text-sm
                          text-muted
                        "
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Searching...
                      </div>
                    )}

                  {!suggestionsLoading &&
                    suggestions
                      .length ===
                      0 && (
                      <div
                        className="
                          px-6
                          py-5
                          text-sm
                          text-muted
                        "
                      >
                        No suggestions
                        found.
                      </div>
                    )}

                  {suggestions.length >
                    0 && (
                    <div className="py-2">

                      {suggestions.map(
                        (
                          suggestion,
                          index,
                        ) => {
                          const isEvent =
                            suggestion.type ===
                            "event";

                          const active =
                            index ===
                            activeSuggestion;

                          return (
                            <button
                              type="button"
                              key={`${suggestion.type}-${suggestion.id}`}
                              onMouseEnter={() =>
                                setActiveSuggestion(
                                  index,
                                )
                              }
                              onClick={() =>
                                selectSuggestion(
                                  suggestion,
                                )
                              }
                              className={`
                                flex
                                w-full
                                items-center
                                gap-4
                                px-5
                                py-4
                                text-left
                                transition
                                ${
                                  active
                                    ? "bg-surface-hover"
                                    : "hover:bg-surface-hover"
                                }
                              `}
                            >

                              <div
                                className="
                                  flex
                                  h-10
                                  w-10
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  border
                                  border-divider
                                  bg-background
                                "
                              >
                                {isEvent ? (
                                  <CalendarDays
                                    className="
                                      h-4
                                      w-4
                                      text-gold
                                    "
                                  />
                                ) : (
                                  <Building2
                                    className="
                                      h-4
                                      w-4
                                      text-gold
                                    "
                                  />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">

                                <p
                                  className="
                                    truncate
                                    font-semibold
                                  "
                                >
                                  {
                                    suggestion.title
                                  }
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-xs
                                    capitalize
                                    text-muted
                                  "
                                >
                                  {
                                    suggestion.type
                                  }
                                </p>

                              </div>

                              <ArrowRight
                                className="
                                  h-4
                                  w-4
                                  shrink-0
                                  text-muted
                                "
                              />

                            </button>
                          );
                        },
                      )}

                      <div
                        className="
                          border-t
                          border-divider
                          p-2
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            submit()
                          }
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-[16px]
                            px-4
                            py-3
                            text-left
                            text-sm
                            font-semibold
                            transition
                            hover:bg-surface-hover
                          "
                        >
                          <span>
                            Search for
                            &quot;
                            {search.trim()}
                            &quot;
                          </span>

                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

          </div>

        </div>

      </section>

      {/* Content */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-6
          py-14
          sm:px-8
          lg:py-20
        "
      >

        {/* Empty Query */}

        {!query && (
          <div
            className="
              flex
              min-h-[360px]
              flex-col
              items-center
              justify-center
              rounded-[32px]
              border
              border-dashed
              border-divider
              px-6
              text-center
            "
          >

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-divider
                bg-surface
              "
            >
              <Search
                className="
                  h-6
                  w-6
                  text-gold
                "
              />
            </div>

            <h2
              className="
                mt-6
                text-2xl
                font-bold
              "
            >
              What do you want
              to experience?
            </h2>

            <p
              className="
                mt-3
                max-w-lg
                leading-7
                text-muted
              "
            >
              Search by event name,
              venue or describe what
              you&apos;re looking for.
            </p>

            <Link
              href="/discover"
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-divider
                px-6
                py-3
                text-sm
                font-semibold
                transition
                hover:bg-surface
              "
            >
              Browse Discovery

              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>
        )}

        {/* Loading */}

        {query &&
          loading && (
            <SearchSkeleton />
          )}

        {/* Error */}

        {query &&
          !loading &&
          error && (
            <div
              className="
                rounded-[30px]
                border
                border-red-500/20
                bg-red-500/5
                p-10
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-red-400
                "
              >
                Search Error
              </p>

              <h2
                className="
                  mt-4
                  text-2xl
                  font-bold
                "
              >
                We couldn&apos;t
                complete your search.
              </h2>

              <p className="mt-3 text-muted">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  router.refresh()
                }
                className="
                  mt-7
                  rounded-full
                  bg-gold
                  px-6
                  py-3
                  font-semibold
                  text-white
                "
              >
                Try Again
              </button>
            </div>
          )}

        {/* No Results */}

        {query &&
          !loading &&
          !error &&
          events.length ===
            0 && (
            <div
              className="
                flex
                min-h-[380px]
                flex-col
                items-center
                justify-center
                rounded-[32px]
                border
                border-dashed
                border-divider
                px-6
                text-center
              "
            >

              <Search
                className="
                  h-8
                  w-8
                  text-muted
                "
              />

              <h2
                className="
                  mt-6
                  text-2xl
                  font-bold
                "
              >
                No events found
              </h2>

              <p
                className="
                  mt-3
                  max-w-lg
                  leading-7
                  text-muted
                "
              >
                Nothing currently
                matches &quot;
                {query}&quot;. Try a
                different event name,
                venue or experience.
              </p>

              <Link
                href="/discover"
                className="
                  mt-8
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-gold
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:scale-[1.02]
                "
              >
                Explore Events

                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>
          )}

        {/* Results */}

        {query &&
          !loading &&
          !error &&
          events.length >
            0 && (
            <>

              <div
                className="
                  mb-10
                  flex
                  flex-col
                  gap-4
                  md:flex-row
                  md:items-end
                  md:justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.35em]
                      text-gold
                    "
                  >
                    Search Results
                  </p>

                  <h2
                    className="
                      mt-3
                      text-3xl
                      font-black
                      sm:text-4xl
                    "
                  >
                    {events.length}{" "}
                    {events.length ===
                    1
                      ? "experience"
                      : "experiences"}
                  </h2>

                </div>

                <p
                  className="
                    max-w-md
                    text-sm
                    text-muted
                    md:text-right
                  "
                >
                  Showing results for{" "}
                  <span className="font-semibold text-foreground">
                    &quot;
                    {query}
                    &quot;
                  </span>
                </p>

              </div>

              <div
                className="
                  grid
                  gap-8
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {events.map(
                  (event) => (
                    <EventCard
                      key={
                        event.id
                      }
                      event={
                        event
                      }
                      formatDate={
                        formatDate
                      }
                    />
                  ),
                )}
              </div>

            </>
          )}

      </section>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Event Card
|--------------------------------------------------------------------------
*/

function EventCard({
  event,
  formatDate,
}: {
  event: SearchEvent;

  formatDate: (
    value: string,
  ) => string;
}) {
  const attendeeCount =
    event._count?.attendees ??
    0;

  const image =
    event.coverImage ??
    event.featuredImage ??
    "/images/placeholder-event.jpg";

  return (
    <Link
      href={`/events/${event.id}`}
      className="
        group
        overflow-hidden
        rounded-[28px]
        border
        border-divider
        bg-surface
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-gold/30
        hover:shadow-2xl
      "
    >

      {/* Image */}

      <div
        className="
          relative
          h-64
          overflow-hidden
        "
      >

        <img
          src={image}
          alt={event.title}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-105
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-black/10
            to-transparent
          "
        />

        {event.category && (
          <div
            className="
              absolute
              left-5
              top-5
            "
          >
            <span
              className="
                inline-flex
                rounded-full
                border
                border-white/10
                bg-black/60
                px-4
                py-2
                text-[11px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white
                backdrop-blur-xl
              "
            >
              {event.category.replaceAll(
                "_",
                " ",
              )}
            </span>
          </div>
        )}

        <div
          className="
            absolute
            bottom-5
            left-5
            right-5
          "
        >
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              text-gold
            "
          >
            {formatDate(
              event.startDate,
            )}
          </p>
        </div>

      </div>

      {/* Body */}

      <div className="p-6">

        <h3
          className="
            text-2xl
            font-bold
            leading-tight
            transition
            group-hover:text-gold
          "
        >
          {event.title}
        </h3>

        {event.organization
          ?.name && (
          <p
            className="
              mt-2
              text-sm
              text-muted
            "
          >
            by{" "}
            <span className="text-foreground">
              {
                event
                  .organization
                  .name
              }
            </span>
          </p>
        )}

        {event.description && (
          <p
            className="
              mt-4
              line-clamp-2
              text-sm
              leading-6
              text-muted
            "
          >
            {event.description}
          </p>
        )}

        <div
          className="
            mt-6
            space-y-3
            border-t
            border-divider
            pt-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-muted
            "
          >
            <MapPin
              className="
                h-4
                w-4
                shrink-0
                text-gold
              "
            />

            <span className="truncate">
              {event.venue}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-muted
            "
          >
            <CalendarDays
              className="
                h-4
                w-4
                shrink-0
                text-gold
              "
            />

            <span>
              {formatDate(
                event.startDate,
              )}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-muted
            "
          >
            <Users
              className="
                h-4
                w-4
                shrink-0
                text-gold
              "
            />

            <span>
              {attendeeCount.toLocaleString(
                "en-US",
              )}{" "}
              {attendeeCount ===
              1
                ? "attendee"
                : "attendees"}
            </span>
          </div>

        </div>

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
          "
        >

          <span
            className="
              text-sm
              font-semibold
              text-foreground
            "
          >
            View Experience
          </span>

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-divider
              transition
              group-hover:border-gold
              group-hover:bg-gold
              group-hover:text-white
            "
          >
            <ArrowRight
              className="
                h-4
                w-4
                transition
                group-hover:translate-x-0.5
              "
            />
          </div>

        </div>

      </div>

    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Loading Skeleton
|--------------------------------------------------------------------------
*/

function SearchSkeleton() {
  return (
    <div className="space-y-10">

      <div className="space-y-3">

        <div
          className="
            h-3
            w-32
            animate-pulse
            rounded-full
            bg-surface
          "
        />

        <div
          className="
            h-10
            w-72
            max-w-full
            animate-pulse
            rounded-xl
            bg-surface
          "
        />

      </div>

      <div
        className="
          grid
          gap-8
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {[1, 2, 3, 4, 5, 6].map(
          (item) => (
            <div
              key={item}
              className="
                overflow-hidden
                rounded-[28px]
                border
                border-divider
                bg-surface
              "
            >

              <div
                className="
                  h-64
                  animate-pulse
                  bg-surface-hover
                "
              />

              <div
                className="
                  space-y-4
                  p-6
                "
              >

                <div
                  className="
                    h-7
                    w-4/5
                    animate-pulse
                    rounded-lg
                    bg-surface-hover
                  "
                />

                <div
                  className="
                    h-4
                    w-1/2
                    animate-pulse
                    rounded
                    bg-surface-hover
                  "
                />

                <div
                  className="
                    h-4
                    w-full
                    animate-pulse
                    rounded
                    bg-surface-hover
                  "
                />

                <div
                  className="
                    h-4
                    w-3/4
                    animate-pulse
                    rounded
                    bg-surface-hover
                  "
                />

              </div>

            </div>
          ),
        )}
      </div>

    </div>
  );
}