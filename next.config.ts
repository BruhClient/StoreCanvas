import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["mu9dfcs0bu.ufs.sh"],
  },
};

export default nextConfig;
