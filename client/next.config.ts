import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {}, // bật Turbopack với config mặc định
  webpack(config, { dev }) {
    if (dev) {
      // tắt source map dev để tránh warning
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
