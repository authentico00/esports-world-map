import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during builds for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
