import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure bundled content/data files are included in serverless functions on Vercel
  outputFileTracingIncludes: {
    "/**": ["./content/**/*", "./data/**/*"],
  },
};

export default nextConfig;
