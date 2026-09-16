export type PulseState =
  | "CALM"
  | "ACTIVE"
  | "SURGING"
  | "CONGESTED"
  | "CRITICAL";

export interface EventPulse {
  eventId: string;

  state: PulseState;

  score: number;

  confidence: number;

  summary: string;

  generatedAt: string;

  capacity: {
    currentOccupancy: number;
    capacity: number;
    occupancyPercentage: number;
    remaining: number;
  };

  movement: {
    arrivalsLast5Minutes: number;
    arrivalsLast15Minutes: number;

    arrivalsPerMinute: number;

    totalCheckIns: number;
    totalCheckOuts: number;

    netMovement: number;

    direction:
      | "INCREASING"
      | "STABLE"
      | "DECREASING";
  };

  operations: {
    onlineStaff: number;
    activityLast15Minutes: number;
  };

  signals: Array<{
    type: string;

    severity:
      | "LOW"
      | "MODERATE"
      | "HIGH"
      | "CRITICAL";

    title: string;

    message: string;
  }>;

  recommendations: Array<{
    priority:
      | "LOW"
      | "MODERATE"
      | "HIGH"
      | "CRITICAL";

    title: string;

    action: string;
  }>;
}

export interface HeatmapCell {
  id: string;

  label: string;

  intensity: number;

  level:
    | "LOW"
    | "MODERATE"
    | "HIGH"
    | "CRITICAL";

  activity: number;

  checkIns: number;

  x: number;

  y: number;

  width: number;

  height: number;
}

export interface EventHeatmap {
  eventId: string;

  mode: "OPERATIONAL";

  generatedAt: string;

  cells: HeatmapCell[];

  legend: {
    min: number;
    max: number;
  };
}

interface PulseResponse {
  success: boolean;

  message?: string;

  pulse?: EventPulse;
}

interface HeatmapResponse {
  success: boolean;

  message?: string;

  heatmap?: EventHeatmap;
}

function getApiUrl(
  path: string,
) {
  const base =
    process.env
      .NEXT_PUBLIC_API_URL;

  if (!base) {
    throw new Error(
      "API URL is not configured.",
    );
  }

  return `${base.replace(
    /\/$/,
    "",
  )}${path}`;
}

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !==
    "undefined"
      ? localStorage.getItem(
          "token",
        )
      : null;

  return {
    Accept:
      "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
  };
}

/*
|--------------------------------------------------------------------------
| Pulse
|--------------------------------------------------------------------------
*/

export async function getEventPulse(
  eventId: string,
): Promise<PulseResponse> {
  const response =
    await fetch(
      getApiUrl(
        `/api/events/${eventId}/intelligence/pulse`,
      ),
      {
        method: "GET",

        headers:
          getAuthHeaders(),

        cache:
          "no-store",
      },
    );

  const data =
    (await response.json()) as PulseResponse;

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Unable to load event pulse.",
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Heatmap
|--------------------------------------------------------------------------
*/

export async function getEventHeatmap(
  eventId: string,
): Promise<HeatmapResponse> {
  const response =
    await fetch(
      getApiUrl(
        `/api/events/${eventId}/intelligence/heatmap`,
      ),
      {
        method: "GET",

        headers:
          getAuthHeaders(),

        cache:
          "no-store",
      },
    );

  const data =
    (await response.json()) as HeatmapResponse;

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Unable to load event heatmap.",
    );
  }

  return data;
}