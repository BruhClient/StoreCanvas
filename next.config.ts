import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    cacheComponents: true,
  },
  images: {
    domains: ["mu9dfcs0bu.ufs.sh", "utfs.io"],
  },
};

export default nextConfig;
