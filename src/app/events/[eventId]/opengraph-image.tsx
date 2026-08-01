import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "white",
          padding: 60,
        }}
      >
        <div
          style={{
            color: "#3E86A4",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          WOWYOU EVENTS
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          Discover Amazing Events
        </div>

        <div
          style={{
            color: "#A0A0A0",
            fontSize: 28,
          }}
        >
          Create • Share • Attend
        </div>

        <div
          style={{
            color: "#3E86A4",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          wowyou.app
        </div>
      </div>
    ),
    size
  );
}