import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            width: 396,
            height: 396,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 124,
            background: "rgba(255,255,255,0.86)",
            boxShadow: "0 20px 60px rgba(37,99,235,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                width: 54,
                height: 156,
                borderRadius: 999,
                background: "#0ea5e9",
                boxShadow: "0 0 0 24px rgba(147,197,253,0.38)",
              }}
            />
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: "50%",
                border: "22px solid #1d4ed8",
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
