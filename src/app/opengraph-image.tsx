import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "80px",
        backgroundColor: "#0f172a",
        backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 32,
          fontWeight: 600,
          color: "#93c5fd",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 56,
            height: 56,
            borderRadius: 9999,
            backgroundColor: "#2563eb",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          +
        </div>
        {SITE_NAME}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 56,
          fontWeight: 700,
          marginTop: 32,
          maxWidth: 900,
        }}
      >
        {SITE_TAGLINE}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          marginTop: 24,
          color: "#cbd5e1",
          maxWidth: 800,
        }}
      >
        Doctors · Dentists · Psychologists · Physiotherapists · Dietitians ·
        Clinics · Hospitals · Pharmacies
      </div>
    </div>,
    { ...size },
  );
}
