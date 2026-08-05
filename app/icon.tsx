import { ImageResponse } from "next/og";

export const size = {
  width: 48,
  height: 48,
};

export const contentType = "image/png";

export function IconGraphic({ fontSize = 24 }: { fontSize?: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        color: "#ffffff",
        borderRadius: 10,
        fontSize,
        fontWeight: 700,
      }}
    >
      <div
        style={{
          width: "62%",
          height: "70%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: 4,
          background: "#e5e7eb",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            height: "27%",
            background: "#9ca3af",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              style={{
                width: "29%",
                height: "25%",
                background: "#ffffff",
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "18%",
          bottom: "16%",
          width: "28%",
          height: "28%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ffffff",
          borderRadius: "50%",
          fontSize,
          fontWeight: 700,
        }}
      >
        T
      </div>
    </div>
  );
}

export default function Icon() {
  return new ImageResponse(<IconGraphic />, size);
}
