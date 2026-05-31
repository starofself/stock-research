import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "STARFOLIO — Korean stock research & trading journal";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1120 0%, #1e293b 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 8, color: "#38bdf8", fontWeight: 700 }}>
          STARFOLIO
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 24, lineHeight: 1.15 }}>
          Korean Stock Research
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, marginTop: 8, color: "#cbd5e1" }}>
          개인 주식 리서치 · 거래일지
        </div>
        <div style={{ fontSize: 28, marginTop: 40, color: "#94a3b8" }}>
          KOSPI · KOSDAQ · sectors · screener · disclosures
        </div>
      </div>
    ),
    size,
  );
}
