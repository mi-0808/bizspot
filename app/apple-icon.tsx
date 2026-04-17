import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.96), rgba(255,255,255,0) 30%), linear-gradient(135deg, #f8fbff 0%, #dbeafe 46%, #93c5fd 100%)",
        }}
      >
        <div
          style={{
            width: 138,
            height: 138,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 42,
            background: "rgba(255,255,255,0.88)",
            boxShadow: "0 10px 28px rgba(37,99,235,0.16)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 18,
                height: 54,
                borderRadius: 999,
                background: "#0ea5e9",
                boxShadow: "0 0 0 8px rgba(147,197,253,0.42)",
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "8px solid #1d4ed8",
                background: "transparent",
              }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
