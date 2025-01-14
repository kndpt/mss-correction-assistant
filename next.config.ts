import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Disable image optimization since it requires a server
  images: {
    unoptimized: true,
  },
  // Indicate that we're running in a Tauri environment
  env: {
    TAURI: String(process.env.TAURI === "true"),
  },
};

export default nextConfig;
