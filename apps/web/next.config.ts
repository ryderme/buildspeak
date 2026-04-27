import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@buildspeak/types"],
  typedRoutes: false,
};

export default config;
