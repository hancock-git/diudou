import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hangfeizk.com",
      },
      {
        protocol: "https",
        hostname: "hangfeizkoss.oss-cn-hangzhou.aliyuncs.com",
      },
    ],
  },
};

export default nextConfig;
