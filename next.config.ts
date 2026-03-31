import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google ユーザーアバター
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Google Places 写真
      { protocol: "https", hostname: "maps.googleapis.com" },
    ],
  },
};

export default nextConfig;
