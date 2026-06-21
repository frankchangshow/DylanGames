import type { NextConfig } from "next";

const staticGameFiles = ["./public/games/**/*", "./out/**/*"];

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/*": staticGameFiles,
    "/api/*": staticGameFiles,
    "/brayden": staticGameFiles,
    "/daddy": staticGameFiles,
    "/dylan": staticGameFiles,
    "/play/*": staticGameFiles
  }
};

export default nextConfig;
