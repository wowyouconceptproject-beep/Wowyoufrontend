const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export interface SearchOrganization {
  id: string;
  name: string;

  logo?: string | null;
  website?: string | null;
}

export interface SearchEvent {
  id: string;

  title: string;

  description?: string | null;

  venue: string;

  coverImage?: string | null;

  featuredImage?: string | null;

  category?: string | null;

  capacity?: number;

  currency?: string;

  startDate: string;

  endDate: string;

  organization?: {
    id: string;
    name: string;
  };

  _count?: {
    attendees: number;
  };
}

export interface SearchSuggestion {
  id: string;

  title: string;

  type:
    | "event"
    | "organization";
}

/*
|--------------------------------------------------------------------------
| Response Types
|--------------------------------------------------------------------------
*/

export interface EventSearchResponse {
  success: boolean;

  query?: string;

  count?: number;

  events: SearchEvent[];

  message?: string;
}

export interface GlobalSearchResponse {
  success: boolean;

  query?: string;

  events: SearchEvent[];

  organizations: SearchOrganization[];

  message?: string;
}

export interface SuggestionsResponse {
  success: boolean;

  query?: string;

  suggestions: SearchSuggestion[];

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getApiUrl() {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured.",
    );
  }

  return API_URL.replace(
    /\/$/,
    "",
  );
}

function normalizeLimit(
  limit?: number,
) {
  if (
    limit === undefined ||
    !Number.isFinite(limit) ||
    limit <= 0
  ) {
    return undefined;
  }

  return Math.min(
    Math.floor(limit),
    50,
  );
}

function buildSearchUrl(
  path: string,
  query: string,
  limit?: number,
) {
  const params =
    new URLSearchParams();

  params.set(
    "q",
    query,
  );

  const normalizedLimit =
    normalizeLimit(limit);

  if (
    normalizedLimit !==
    undefined
  ) {
    params.set(
      "limit",
      String(
        normalizedLimit,
      ),
    );
  }

  return `${getApiUrl()}${path}?${params.toString()}`;
}

async function parseJson(
  response: Response,
) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Event Search
|--------------------------------------------------------------------------
|
| Backend:
|
| GET /search/events?q=conference
| GET /search/events?q=conference&limit=20
|
|--------------------------------------------------------------------------
*/

export async function searchEvents(
  query: string,
  limit?: number,
): Promise<EventSearchResponse> {
  const q =
    query.trim();

  if (!q) {
    return {
      success: true,
      query: "",
      count: 0,
      events: [],
    };
  }

  try {
    const response =
      await fetch(
        buildSearchUrl(
          "/search/events",
          q,
          limit,
        ),
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache: "no-store",
        },
      );

    const data =
      await parseJson(
        response,
      );

    if (!response.ok) {
      return {
        success: false,

        query: q,

        count: 0,

        events: [],

        message:
          data?.message ??
          "Unable to search events.",
      };
    }

    const events:
      SearchEvent[] =
        data?.events ?? [];

    return {
      success:
        data?.success === true,

      query:
        data?.query ?? q,

      count:
        typeof data?.count ===
        "number"
          ? data.count
          : events.length,

      events,

      message:
        data?.message,
    };
  } catch (error) {
    console.error(
      "EVENT SEARCH ERROR:",
      error,
    );

    return {
      success: false,

      query: q,

      count: 0,

      events: [],

      message:
        "Unable to connect to search.",
    };
  }
}

/*
|--------------------------------------------------------------------------
| Global Search
|--------------------------------------------------------------------------
|
| Backend:
|
| GET /search?q=lagos
| GET /search?q=lagos&limit=20
|
| Returns:
|
| - Events
| - Organizations
|
|--------------------------------------------------------------------------
*/

export async function globalSearch(
  query: string,
  limit?: number,
): Promise<GlobalSearchResponse> {
  const q =
    query.trim();

  if (!q) {
    return {
      success: true,

      query: "",

      events: [],

      organizations: [],
    };
  }

  try {
    const response =
      await fetch(
        buildSearchUrl(
          "/search",
          q,
          limit,
        ),
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache: "no-store",
        },
      );

    const data =
      await parseJson(
        response,
      );

    if (!response.ok) {
      return {
        success: false,

        query: q,

        events: [],

        organizations: [],

        message:
          data?.message ??
          "Search failed.",
      };
    }

    return {
      success:
        data?.success === true,

      query:
        data?.query ?? q,

      events:
        data?.events ?? [],

      organizations:
        data?.organizations ??
        [],

      message:
        data?.message,
    };
  } catch (error) {
    console.error(
      "GLOBAL SEARCH ERROR:",
      error,
    );

    return {
      success: false,

      query: q,

      events: [],

      organizations: [],

      message:
        "Unable to connect to search.",
    };
  }
}

/*
|--------------------------------------------------------------------------
| Search Suggestions
|--------------------------------------------------------------------------
|
| Backend:
|
| GET /search/suggestions?q=lag
|
| Used for live autocomplete.
|
|--------------------------------------------------------------------------
*/

export async function getSearchSuggestions(
  query: string,
): Promise<SuggestionsResponse> {
  const q =
    query.trim();

  /*
  |--------------------------------------------------------------------------
  | Match Backend Behaviour
  |--------------------------------------------------------------------------
  |
  | Backend does not perform a suggestion search
  | until the query contains at least 2 characters.
  |
  */

  if (
    !q ||
    q.length < 2
  ) {
    return {
      success: true,

      query: q,

      suggestions: [],
    };
  }

  try {
    const response =
      await fetch(
        buildSearchUrl(
          "/search/suggestions",
          q,
        ),
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache: "no-store",
        },
      );

    const data =
      await parseJson(
        response,
      );

    if (!response.ok) {
      return {
        success: false,

        query: q,

        suggestions: [],

        message:
          data?.message ??
          "Unable to load suggestions.",
      };
    }

    return {
      success:
        data?.success === true,

      query:
        data?.query ?? q,

      suggestions:
        data?.suggestions ?? [],

      message:
        data?.message,
    };
  } catch (error) {
    console.error(
      "SEARCH SUGGESTIONS ERROR:",
      error,
    );

    return {
      success: false,

      query: q,

      suggestions: [],

      message:
        "Unable to load suggestions.",
    };
  }
}