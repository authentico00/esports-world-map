import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable tracing to fix Windows EPERM errors
  experimental: {
    instrumentationHook: false,
  },
  // Disable telemetry and tracing
  telemetry: false,
};

export default nextConfig;
