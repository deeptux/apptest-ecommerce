import type { NextConfig } from "next";

const basePath = "/demo/point-of-sale-resto";

const nextConfig: NextConfig = {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
  reactCompiler: true,
  experimental: {
    
  },
};

export default nextConfig;