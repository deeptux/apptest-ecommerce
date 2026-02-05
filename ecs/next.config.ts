import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'placehold.co',
      pathname: '/**',
    }], // Add this line
  },
  reactCompiler: true,
};

export default nextConfig;