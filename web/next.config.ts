import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/list-din-bedrift",
        destination: "/for-bedrifter",
        permanent: true,
      },
      {
        source: "/list-din-bedrifter",
        destination: "/for-bedrifter",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
