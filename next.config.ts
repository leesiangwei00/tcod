import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "./" : "",
  basePath: "",
  // Ensure static files are properly handled in Electron
  publicRuntimeConfig: {
    staticFolder: "/out",
  },
};

export default nextConfig;
